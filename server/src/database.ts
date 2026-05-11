import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { config } from "./config.js";
import {
  defaultAboutPage,
  defaultCompanyProfile,
  defaultProjects,
  defaultSocialLinks,
  defaultTestimonials,
} from "./defaults.js";

type ParsedConnection = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

let pool: mysql.Pool | null = null;

const legacyDefaultProjectImageUrls = [
  "default:hero-residential",
  "default:hero-commercial",
  "default:hero-industrial",
];

const migrationStatements = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(40) NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(190) NULL,
    phone VARCHAR(50) NOT NULL,
    monthly_bill DECIMAL(10,2) NULL,
    message TEXT NULL,
    source_page VARCHAR(255) NULL,
    referrer TEXT NULL,
    utm_source VARCHAR(150) NULL,
    utm_medium VARCHAR(150) NULL,
    utm_campaign VARCHAR(150) NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'new',
    admin_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    status VARCHAR(40) NOT NULL DEFAULT 'active',
    source_page VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(190) NOT NULL,
    capacity VARCHAR(80) NOT NULL,
    co2_savings VARCHAR(80) NOT NULL,
    category VARCHAR(120) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_featured TINYINT(1) NOT NULL DEFAULT 1,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    role VARCHAR(190) NOT NULL,
    text TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    initials VARCHAR(8) NULL,
    image_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS google_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_review_name VARCHAR(255) NOT NULL UNIQUE,
    reviewer_name VARCHAR(160) NOT NULL,
    reviewer_is_anonymous TINYINT(1) NOT NULL DEFAULT 0,
    reviewer_profile_photo_url VARCHAR(500) NULL,
    rating INT NOT NULL DEFAULT 5,
    comment TEXT NULL,
    relative_time_label VARCHAR(80) NULL,
    review_create_time DATETIME NULL,
    review_update_time DATETIME NULL,
    review_reply_comment TEXT NULL,
    review_reply_update_time DATETIME NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_google_reviews_published (is_published, review_update_time)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(120) PRIMARY KEY,
    setting_value JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    size_bytes BIGINT NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'general',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(120) NOT NULL,
    path VARCHAR(255) NULL,
    referrer TEXT NULL,
    utm_source VARCHAR(150) NULL,
    utm_medium VARCHAR(150) NULL,
    utm_campaign VARCHAR(150) NULL,
    session_id VARCHAR(190) NULL,
    payload_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS crm_sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    target VARCHAR(120) NOT NULL,
    status VARCHAR(40) NOT NULL,
    response_text TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_crm_sync_logs_lead_id (lead_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

const parseDatabaseUrl = (databaseUrl: string): ParsedConnection => {
  const parsed = new URL(databaseUrl);

  if (parsed.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use the mysql:// protocol.");
  }

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
  };
};

const ensureDatabaseExists = async ({ host, port, user, password, database }: ParsedConnection) => {
  const adminConnection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  try {
    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await adminConnection.end();
  }
};

const insertSettingsIfMissing = async (db: mysql.Pool) => {
  const settings = {
    company_profile: defaultCompanyProfile,
    about_page: defaultAboutPage,
    social_links: defaultSocialLinks,
  };

  for (const [settingKey, settingValue] of Object.entries(settings)) {
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_key = setting_key`,
      [settingKey, JSON.stringify(settingValue)],
    );
  }
};

const seedAdminIfMissing = async (db: mysql.Pool) => {
  const [rows] = await db.query<any[]>("SELECT COUNT(*) AS total FROM admins");

  if (Number(rows[0]?.total ?? 0) > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(config.defaultAdmin.password, 10);

  await db.execute(
    `INSERT INTO admins (name, email, password_hash, role)
     VALUES (?, ?, ?, 'super_admin')`,
    [config.defaultAdmin.name, config.defaultAdmin.email, passwordHash],
  );
};

const seedProjectsIfMissing = async (db: mysql.Pool) => {
  const [rows] = await db.query<any[]>("SELECT COUNT(*) AS total FROM projects");

  if (Number(rows[0]?.total ?? 0) > 0) {
    return;
  }

  for (const project of defaultProjects) {
    await db.execute(
      `INSERT INTO projects
        (title, location, capacity, co2_savings, category, description, image_url, sort_order, is_featured, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.title,
        project.location,
        project.capacity,
        project.co2Savings,
        project.category,
        project.description,
        project.imageUrl,
        project.sortOrder,
        project.isFeatured ? 1 : 0,
        project.isPublished ? 1 : 0,
      ],
    );
  }
};

const syncSeedProjectImages = async (db: mysql.Pool) => {
  for (const project of defaultProjects) {
    await db.execute(
      `UPDATE projects
       SET image_url = ?
       WHERE title = ?
         AND image_url IN (?, ?, ?)`,
      [
        project.imageUrl,
        project.title,
        legacyDefaultProjectImageUrls[0],
        legacyDefaultProjectImageUrls[1],
        legacyDefaultProjectImageUrls[2],
      ],
    );
  }
};

const seedTestimonialsIfMissing = async (db: mysql.Pool) => {
  const [rows] = await db.query<any[]>("SELECT COUNT(*) AS total FROM testimonials");

  if (Number(rows[0]?.total ?? 0) > 0) {
    return;
  }

  for (const testimonial of defaultTestimonials) {
    await db.execute(
      `INSERT INTO testimonials
        (name, role, text, rating, initials, image_url, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testimonial.name,
        testimonial.role,
        testimonial.text,
        testimonial.rating,
        testimonial.initials,
        null,
        testimonial.sortOrder,
        testimonial.isPublished ? 1 : 0,
      ],
    );
  }
};

const runMigrations = async (db: mysql.Pool) => {
  for (const statement of migrationStatements) {
    await db.execute(statement);
  }
};

const ensureGoogleReviewColumns = async (db: mysql.Pool) => {
  const [rows] = await db.query<any[]>(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'google_reviews'
       AND COLUMN_NAME = 'relative_time_label'`,
  );

  if (Number(rows[0]?.total ?? 0) === 0) {
    await db.execute(
      "ALTER TABLE google_reviews ADD COLUMN relative_time_label VARCHAR(80) NULL AFTER comment",
    );
  }
};

export const initDatabase = async () => {
  if (!config.databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Copy .env.example to .env and set mysql://USER:PASSWORD@localhost:3306/suntek",
    );
  }

  const parsedConnection = parseDatabaseUrl(config.databaseUrl);

  if (!parsedConnection.database) {
    throw new Error("DATABASE_URL must include a database name, for example /suntek.");
  }

  if (config.databaseAutoCreate) {
    await ensureDatabaseExists(parsedConnection);
  }

  pool = mysql.createPool({
    host: parsedConnection.host,
    port: parsedConnection.port,
    user: parsedConnection.user,
    password: parsedConnection.password,
    database: parsedConnection.database,
    connectionLimit: 10,
    namedPlaceholders: true,
  });

  await runMigrations(pool);
  await ensureGoogleReviewColumns(pool);
  await insertSettingsIfMissing(pool);
  await seedAdminIfMissing(pool);
  await seedProjectsIfMissing(pool);
  await syncSeedProjectImages(pool);
  await seedTestimonialsIfMissing(pool);

  return pool;
};

export const getDb = () => {
  if (!pool) {
    throw new Error("Database not initialized.");
  }

  return pool;
};

export const parseJsonValue = <T>(value: unknown, fallback: T): T => {
  if (value == null) {
    return fallback;
  }

  if (typeof value === "object") {
    return value as T;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getSettingsMap = async () => {
  const db = getDb();
  const [rows] = await db.query<any[]>(
    "SELECT setting_key, setting_value, updated_at FROM site_settings ORDER BY setting_key ASC",
  );

  return rows.reduce<Record<string, unknown>>((acc, row) => {
    acc[row.setting_key] = parseJsonValue(row.setting_value, {});
    return acc;
  }, {});
};
