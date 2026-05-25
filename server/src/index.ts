import fs from "fs/promises";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { z } from "zod";
import type { ResultSetHeader } from "mysql2/promise";
import {
  fallbackGoogleReviewTestimonials,
  fallbackGoogleReviewUrl,
} from "../../shared/google-review-fallback.js";
import { requireAdmin, signAdminToken, type AuthenticatedRequest } from "./auth.js";
import { config } from "./config.js";
import {
  defaultAboutPage,
  defaultCompanyProfile,
  defaultProjects,
  defaultSocialLinks,
  defaultTestimonials,
} from "./defaults.js";
import { getDb, getSettingsMap, initDatabase, parseJsonValue } from "./database.js";
import {
  getGoogleReviewSyncStatus,
  maybeSyncGoogleBusinessProfileReviews,
  syncGoogleBusinessProfileReviews,
} from "./google-reviews.js";
import { sendLeadNotifications } from "./integrations.js";

const app = express();

const leadSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(8).max(50),
  pinCode: z.string().trim().max(12).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  bill: z.union([z.number(), z.string()]).optional().nullable(),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  sourcePage: z.string().trim().max(255).optional().or(z.literal("")),
  referrer: z.string().trim().max(1000).optional().or(z.literal("")),
  utmSource: z.string().trim().max(150).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(150).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(150).optional().or(z.literal("")),
});

const newsletterSchema = z.object({
  email: z.string().trim().email(),
  sourcePage: z.string().trim().max(255).optional().or(z.literal("")),
});

const analyticsSchema = z.object({
  eventName: z.string().trim().min(2).max(120),
  path: z.string().trim().max(255).optional().or(z.literal("")),
  referrer: z.string().trim().max(1000).optional().or(z.literal("")),
  utmSource: z.string().trim().max(150).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(150).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(150).optional().or(z.literal("")),
  sessionId: z.string().trim().max(190).optional().or(z.literal("")),
  payload: z.record(z.any()).optional(),
});

const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

const projectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  location: z.string().trim().min(2).max(190),
  capacity: z.string().trim().min(1).max(80),
  co2Savings: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2500).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(190),
  text: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  initials: z.string().trim().max(8).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  isPublished: z.boolean().optional(),
});

const leadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]),
  adminNotes: z.string().trim().max(4000).optional().or(z.literal("")),
});

const companyProfileSchema = z.object({
  name: z.string().trim().min(2).max(190),
  shortName: z.string().trim().min(2).max(80),
  yearEstablished: z.number().int().min(1900).max(2100),
  phone: z.string().trim().min(8).max(50),
  alternatePhone: z.string().trim().max(50).optional().or(z.literal("")),
  email: z.string().trim().email(),
  notificationsEmail: z.string().trim().email(),
  whatsapp: z.string().trim().min(8).max(50),
  address: z.string().trim().min(5).max(255),
  workingHours: z.string().trim().min(3).max(120),
  mapEmbedUrl: z.string().trim().url(),
  footerBlurb: z.string().trim().min(20).max(800),
  googleReviewUrl: z.string().trim().url().optional().or(z.literal("")),
});

const aboutPageSchema = z.object({
  storyTitle: z.string().trim().min(3).max(160),
  storyParagraph1: z.string().trim().min(30).max(1500),
  storyParagraph2: z.string().trim().min(20).max(1500),
});

const socialLinksSchema = z.object({
  facebook: z.string().trim().optional().or(z.literal("")),
  instagram: z.string().trim().optional().or(z.literal("")),
  linkedin: z.string().trim().optional().or(z.literal("")),
  youtube: z.string().trim().optional().or(z.literal("")),
});

const assetUpdateSchema = z.object({
  originalName: z.string().trim().min(1).max(255),
  category: z.string().trim().min(1).max(80),
});

const settingValidators = {
  company_profile: companyProfileSchema,
  about_page: aboutPageSchema,
  social_links: socialLinksSchema,
} as const;

const toNumberOrNull = (value: unknown) => {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const slugifyFileName = (fileName: string) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toInitials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const normalizeReviewText = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/([.!?])([A-Za-z"'])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();

const toProject = (row: any) => ({
  id: row.id,
  title: row.title,
  location: row.location,
  capacity: row.capacity,
  co2Savings: row.co2_savings,
  category: row.category,
  description: row.description || "",
  imageUrl: row.image_url || "",
  sortOrder: row.sort_order,
  isFeatured: Boolean(row.is_featured),
  isPublished: Boolean(row.is_published),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toTestimonial = (row: any) => ({
  id: row.id,
  sourceId: `manual:${row.id}`,
  name: row.name,
  role: row.role,
  text: row.text,
  rating: row.rating,
  initials: row.initials || "",
  imageUrl: row.image_url || "",
  sortOrder: row.sort_order,
  isPublished: Boolean(row.is_published),
  source: "manual" as const,
  sourceLabel: "Customer Review",
  reviewedAt: row.updated_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toGoogleReviewTestimonial = (row: any, googleReviewUrl?: string) => ({
  id: row.id,
  sourceId: row.google_review_name,
  name: row.reviewer_name,
  role: row.relative_time_label ? `Google Review - ${row.relative_time_label}` : "Google Review",
  text: normalizeReviewText(row.comment || "Rated this business on Google."),
  rating: row.rating,
  initials: toInitials(row.reviewer_name || "Google User"),
  imageUrl: row.reviewer_profile_photo_url || "",
  sortOrder: row.sort_order,
  isPublished: Boolean(row.is_published),
  source: "google" as const,
  sourceLabel: "Google Review",
  sourceUrl: googleReviewUrl || "",
  reviewedAt: null,
  replyText: normalizeReviewText(row.review_reply_comment || ""),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const loadPublicContent = async () => {
  const db = getDb();
  const settings = await getSettingsMap();
  const companyProfile = {
    ...defaultCompanyProfile,
    ...parseJsonValue(settings.company_profile, {}),
  };

  const googleReviewUrl = companyProfile.googleReviewUrl || defaultCompanyProfile.googleReviewUrl || fallbackGoogleReviewUrl;

  const syncStatus = await maybeSyncGoogleBusinessProfileReviews();

  if (syncStatus.lastError) {
    console.error("Google review sync skipped/failed:", syncStatus.lastError);
  }

  const [projectRows] = await db.query<any[]>(
    `SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC, id DESC`,
  );
  const [testimonialRows] = await db.query<any[]>(
    `SELECT * FROM testimonials WHERE is_published = 1 ORDER BY sort_order ASC, id DESC`,
  );
  const [googleReviewRows] = await db.query<any[]>(
    `SELECT * FROM google_reviews WHERE is_published = 1 ORDER BY review_update_time DESC, id DESC`,
  );

  const manualTestimonials = testimonialRows.length > 0 ? testimonialRows.map(toTestimonial) : defaultTestimonials;
  const googleTestimonials =
    googleReviewRows.length > 0
      ? googleReviewRows.map((row) => toGoogleReviewTestimonial(row, googleReviewUrl))
      : fallbackGoogleReviewTestimonials.map((item) => ({ ...item, sourceUrl: googleReviewUrl }));

  return {
    companyProfile,
    aboutPage: {
      ...defaultAboutPage,
      ...parseJsonValue(settings.about_page, {}),
    },
    socialLinks: {
      ...defaultSocialLinks,
      ...parseJsonValue(settings.social_links, {}),
    },
    projects: projectRows.length > 0 ? projectRows.map(toProject) : defaultProjects,
    testimonials: googleTestimonials.length > 0 ? [...googleTestimonials, ...manualTestimonials] : manualTestimonials,
  };
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, config.uploadsDir);
  },
  filename: (_req, file, callback) => {
    const timestamp = Date.now();
    const cleanName = slugifyFileName(file.originalname || "upload");
    callback(null, `${timestamp}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(config.uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "suntek-api" });
});

app.get("/api/public/content", async (_req, res, next) => {
  try {
    const content = await loadPublicContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

app.post("/api/leads", async (req, res, next) => {
  try {
    const parsed = leadSchema.parse(req.body);
    const db = getDb();
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO leads
        (name, email, phone, pin_code, city, monthly_bill, message, source_page, referrer, utm_source, utm_medium, utm_campaign)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.name,
        parsed.email || null,
        parsed.phone,
        parsed.pinCode || null,
        parsed.city || null,
        toNumberOrNull(parsed.bill),
        parsed.message || null,
        parsed.sourcePage || null,
        parsed.referrer || null,
        parsed.utmSource || null,
        parsed.utmMedium || null,
        parsed.utmCampaign || null,
      ],
    );

    const content = await loadPublicContent();
    const leadPayload = {
      id: result.insertId,
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone,
      pinCode: parsed.pinCode || null,
      city: parsed.city || null,
      monthlyBill: toNumberOrNull(parsed.bill),
      message: parsed.message || null,
      sourcePage: parsed.sourcePage || null,
      referrer: parsed.referrer || null,
      utmSource: parsed.utmSource || null,
      utmMedium: parsed.utmMedium || null,
      utmCampaign: parsed.utmCampaign || null,
      createdAt: new Date().toISOString(),
    };

    void sendLeadNotifications(getDb(), leadPayload, content.companyProfile).catch((error) => {
      console.error("Lead notification error:", error);
    });

    res.status(201).json({
      success: true,
      leadId: result.insertId,
      message: "Lead saved successfully.",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/newsletter", async (req, res, next) => {
  try {
    const parsed = newsletterSchema.parse(req.body);
    const db = getDb();

    await db.execute(
      `INSERT INTO newsletter_subscribers (email, source_page)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE status = 'active', source_page = VALUES(source_page)`,
      [parsed.email, parsed.sourcePage || null],
    );

    res.status(201).json({
      success: true,
      message: "Subscribed successfully.",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/analytics/events", async (req, res, next) => {
  try {
    const parsed = analyticsSchema.parse(req.body);
    const db = getDb();

    await db.execute(
      `INSERT INTO analytics_events
        (event_name, path, referrer, utm_source, utm_medium, utm_campaign, session_id, payload_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.eventName,
        parsed.path || null,
        parsed.referrer || null,
        parsed.utmSource || null,
        parsed.utmMedium || null,
        parsed.utmCampaign || null,
        parsed.sessionId || null,
        parsed.payload ? JSON.stringify(parsed.payload) : null,
      ],
    );

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", async (req, res, next) => {
  try {
    const parsed = adminLoginSchema.parse(req.body);
    const db = getDb();
    const [rows] = await db.query<any[]>("SELECT * FROM admins WHERE email = ? LIMIT 1", [parsed.email]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(parsed.password, admin.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signAdminToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/session", requireAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ admin: req.admin });
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const db = getDb();
    const [[leadStats]] = await db.query<any[]>(
      `SELECT
        COUNT(*) AS totalLeads,
        SUM(status = 'new') AS newLeads,
        SUM(status = 'won') AS wonLeads
       FROM leads`,
    );
    const [[newsletterStats]] = await db.query<any[]>(
      "SELECT COUNT(*) AS totalSubscribers FROM newsletter_subscribers WHERE status = 'active'",
    );
    const [[projectStats]] = await db.query<any[]>("SELECT COUNT(*) AS totalProjects FROM projects WHERE is_published = 1");
    const [[testimonialStats]] = await db.query<any[]>(
      "SELECT COUNT(*) AS totalTestimonials FROM testimonials WHERE is_published = 1",
    );
    const [recentLeads] = await db.query<any[]>(
      `SELECT id, name, email, phone, status, source_page, created_at
       FROM leads
       ORDER BY created_at DESC
       LIMIT 8`,
    );
    const [topPages] = await db.query<any[]>(
      `SELECT COALESCE(path, 'Unknown') AS path, COUNT(*) AS total
       FROM analytics_events
       WHERE event_name = 'page_view'
       GROUP BY path
       ORDER BY total DESC
       LIMIT 5`,
    );
    const [leadSources] = await db.query<any[]>(
      `SELECT COALESCE(NULLIF(utm_source, ''), 'Direct') AS source, COUNT(*) AS total
       FROM leads
       GROUP BY source
       ORDER BY total DESC
       LIMIT 5`,
    );

    res.json({
      stats: {
        totalLeads: Number(leadStats?.totalLeads ?? 0),
        newLeads: Number(leadStats?.newLeads ?? 0),
        wonLeads: Number(leadStats?.wonLeads ?? 0),
        totalSubscribers: Number(newsletterStats?.totalSubscribers ?? 0),
        totalProjects: Number(projectStats?.totalProjects ?? 0),
        totalTestimonials: Number(testimonialStats?.totalTestimonials ?? 0),
      },
      recentLeads,
      topPages,
      leadSources,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/leads", requireAdmin, async (_req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.query<any[]>(
      `SELECT *
       FROM leads
       ORDER BY created_at DESC
       LIMIT 250`,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/leads/:id", requireAdmin, async (req, res, next) => {
  try {
    const parsed = leadUpdateSchema.parse(req.body);
    const leadId = Number(req.params.id);
    const db = getDb();

    await db.execute(
      `UPDATE leads
       SET status = ?, admin_notes = ?
       WHERE id = ?`,
      [parsed.status, parsed.adminNotes || null, leadId],
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/projects", requireAdmin, async (_req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.query<any[]>("SELECT * FROM projects ORDER BY sort_order ASC, id DESC");
    res.json(rows.map(toProject));
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/projects", requireAdmin, async (req, res, next) => {
  try {
    const parsed = projectSchema.parse(req.body);
    const db = getDb();
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO projects
        (title, location, capacity, co2_savings, category, description, image_url, sort_order, is_featured, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.title,
        parsed.location,
        parsed.capacity,
        parsed.co2Savings,
        parsed.category,
        parsed.description || null,
        parsed.imageUrl || null,
        parsed.sortOrder ?? 0,
        parsed.isFeatured === false ? 0 : 1,
        parsed.isPublished === false ? 0 : 1,
      ],
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/projects/:id", requireAdmin, async (req, res, next) => {
  try {
    const parsed = projectSchema.parse(req.body);
    const projectId = Number(req.params.id);
    const db = getDb();

    await db.execute(
      `UPDATE projects
       SET title = ?, location = ?, capacity = ?, co2_savings = ?, category = ?, description = ?, image_url = ?, sort_order = ?, is_featured = ?, is_published = ?
       WHERE id = ?`,
      [
        parsed.title,
        parsed.location,
        parsed.capacity,
        parsed.co2Savings,
        parsed.category,
        parsed.description || null,
        parsed.imageUrl || null,
        parsed.sortOrder ?? 0,
        parsed.isFeatured === false ? 0 : 1,
        parsed.isPublished === false ? 0 : 1,
        projectId,
      ],
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/projects/:id", requireAdmin, async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const db = getDb();
    await db.execute("DELETE FROM projects WHERE id = ?", [projectId]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/testimonials", requireAdmin, async (_req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.query<any[]>("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC");
    res.json(rows.map(toTestimonial));
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/testimonials", requireAdmin, async (req, res, next) => {
  try {
    const parsed = testimonialSchema.parse(req.body);
    const db = getDb();
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO testimonials
        (name, role, text, rating, initials, image_url, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.name,
        parsed.role,
        parsed.text,
        parsed.rating,
        parsed.initials || null,
        parsed.imageUrl || null,
        parsed.sortOrder ?? 0,
        parsed.isPublished === false ? 0 : 1,
      ],
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res, next) => {
  try {
    const parsed = testimonialSchema.parse(req.body);
    const testimonialId = Number(req.params.id);
    const db = getDb();

    await db.execute(
      `UPDATE testimonials
       SET name = ?, role = ?, text = ?, rating = ?, initials = ?, image_url = ?, sort_order = ?, is_published = ?
       WHERE id = ?`,
      [
        parsed.name,
        parsed.role,
        parsed.text,
        parsed.rating,
        parsed.initials || null,
        parsed.imageUrl || null,
        parsed.sortOrder ?? 0,
        parsed.isPublished === false ? 0 : 1,
        testimonialId,
      ],
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res, next) => {
  try {
    const testimonialId = Number(req.params.id);
    const db = getDb();
    await db.execute("DELETE FROM testimonials WHERE id = ?", [testimonialId]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/google-reviews/status", requireAdmin, async (_req, res, next) => {
  try {
    const status = await getGoogleReviewSyncStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/google-reviews/sync", requireAdmin, async (_req, res, next) => {
  try {
    const status = await syncGoogleBusinessProfileReviews({ force: true });
    res.json(status);
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/settings", requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getSettingsMap();
    res.json({
      company_profile: {
        ...defaultCompanyProfile,
        ...parseJsonValue(settings.company_profile, {}),
      },
      about_page: {
        ...defaultAboutPage,
        ...parseJsonValue(settings.about_page, {}),
      },
      social_links: {
        ...defaultSocialLinks,
        ...parseJsonValue(settings.social_links, {}),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/settings/:key", requireAdmin, async (req, res, next) => {
  try {
    const settingKey = req.params.key as keyof typeof settingValidators;
    const validator = settingValidators[settingKey];

    if (!validator) {
      return res.status(404).json({ message: "Unknown settings key." });
    }

    const value = validator.parse(req.body?.value);
    const db = getDb();

    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [settingKey, JSON.stringify(value)],
    );

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/assets", requireAdmin, async (_req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.query<any[]>(
      `SELECT *
       FROM assets
       ORDER BY created_at DESC
       LIMIT 100`,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/assets/:id", requireAdmin, async (req, res, next) => {
  try {
    const assetId = Number(req.params.id);
    const parsed = assetUpdateSchema.parse(req.body);
    const db = getDb();

    await db.execute(
      `UPDATE assets
       SET original_name = ?, category = ?
       WHERE id = ?`,
      [parsed.originalName, parsed.category, assetId],
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/assets/:id", requireAdmin, async (req, res, next) => {
  try {
    const assetId = Number(req.params.id);
    const db = getDb();
    const [rows] = await db.query<any[]>(
      `SELECT id, file_name, file_url
       FROM assets
       WHERE id = ?
       LIMIT 1`,
      [assetId],
    );
    const asset = rows[0];

    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    const [projectCleanup] = await db.execute<ResultSetHeader>(
      `UPDATE projects
       SET image_url = NULL
       WHERE image_url = ?`,
      [asset.file_url],
    );
    const [testimonialCleanup] = await db.execute<ResultSetHeader>(
      `UPDATE testimonials
       SET image_url = NULL
       WHERE image_url = ?`,
      [asset.file_url],
    );

    await db.execute("DELETE FROM assets WHERE id = ?", [assetId]);

    try {
      await fs.unlink(path.resolve(config.uploadsDir, asset.file_name));
    } catch (fileError) {
      if ((fileError as { code?: string }).code !== "ENOENT") {
        throw fileError;
      }
    }

    return res.json({
      success: true,
      removedReferences: {
        projects: Number(projectCleanup.affectedRows ?? 0),
        testimonials: Number(testimonialCleanup.affectedRows ?? 0),
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/admin/uploads", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const category = typeof req.body.category === "string" ? req.body.category : "general";
    const db = getDb();
    const fileUrl = `/uploads/${req.file.filename}`;

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO assets (original_name, file_name, file_url, mime_type, size_bytes, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.file.originalname,
        req.file.filename,
        fileUrl,
        req.file.mimetype,
        req.file.size,
        category,
      ],
    );

    return res.status(201).json({
      success: true,
      asset: {
        id: result.insertId,
        original_name: req.file.originalname,
        file_name: req.file.filename,
        file_url: fileUrl,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
        category,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      issues: error.flatten(),
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: error instanceof Error ? error.message : "Internal server error.",
  });
});

const start = async () => {
  await fs.mkdir(config.uploadsDir, { recursive: true });
  await initDatabase();

  app.listen(config.apiPort, () => {
    console.log(`SUNTECH API listening on http://localhost:${config.apiPort}`);
  });
};

start().catch((error) => {
  console.error("Failed to start SUNTECH API:", error);
  process.exit(1);
});
