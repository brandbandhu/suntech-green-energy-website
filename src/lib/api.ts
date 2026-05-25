import type {
  AboutPageContent,
  CompanyProfile,
  ProjectItem,
  PublicContent,
  SocialLinks,
  TestimonialItem,
} from "@/lib/default-content";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type AdminUser = {
  id?: number;
  adminId?: number;
  name: string;
  email: string;
  role: string;
};

export type AdminSessionResponse = {
  token: string;
  admin: AdminUser;
};

export type LeadRecord = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  pin_code: string | null;
  city: string | null;
  monthly_bill: number | null;
  message: string | null;
  source_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardResponse = {
  stats: {
    totalLeads: number;
    newLeads: number;
    wonLeads: number;
    totalSubscribers: number;
    totalProjects: number;
    totalTestimonials: number;
  };
  recentLeads: Array<{
    id: number;
    name: string;
    email: string | null;
    phone: string;
    status: string;
    source_page: string | null;
    created_at: string;
  }>;
  topPages: Array<{ path: string; total: number }>;
  leadSources: Array<{ source: string; total: number }>;
};

export type AdminSettingsResponse = {
  company_profile: CompanyProfile;
  about_page: AboutPageContent;
  social_links: SocialLinks;
};

export type GoogleReviewSyncStatus = {
  configured: boolean;
  autoSync: boolean;
  locationName: string;
  totalSynced: number;
  lastSyncedAt: string | null;
  lastAttemptAt: string | null;
  lastError: string | null;
  syncedNow?: number;
};

export type AssetRecord = {
  id: number;
  original_name: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  size_bytes: number;
  category: string;
  created_at: string;
};

export type AssetUpdateInput = {
  originalName: string;
  category: string;
};

export type LeadSubmissionInput = {
  name: string;
  email?: string;
  phone: string;
  pinCode?: string;
  city?: string;
  bill?: string;
  message?: string;
  sourcePage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type AnalyticsEventInput = {
  eventName: string;
  path?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
};

type RequestOptions = RequestInit & {
  token?: string;
};

type ApiError = Error & {
  status?: number;
  details?: unknown;
};

const toApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const parseJsonResponse = async <T>(response: Response) => {
  const text = await response.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.") as ApiError;
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data as T;
};

const apiRequest = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;

  try {
    response = await fetch(toApiUrl(path), {
      ...options,
      headers,
    });
  } catch {
    const error = new Error(
      "Cannot reach the backend API. Start `npm run server` and configure `.env` with your MySQL DATABASE_URL.",
    ) as ApiError;
    error.status = 0;
    throw error;
  }

  return parseJsonResponse<T>(response);
};

export const getPublicContent = () => apiRequest<PublicContent>("/api/public/content");

export const submitLead = (payload: LeadSubmissionInput) =>
  apiRequest<{ success: boolean; leadId: number }>("/api/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const subscribeNewsletter = (payload: { email: string; sourcePage?: string }) =>
  apiRequest<{ success: boolean }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const postAnalyticsEvent = (payload: AnalyticsEventInput) =>
  apiRequest<{ success: boolean }>("/api/analytics/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminLogin = (email: string, password: string) =>
  apiRequest<AdminSessionResponse>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getAdminSession = (token: string) =>
  apiRequest<{ admin: AdminUser }>("/api/admin/session", { token });

export const getAdminDashboard = (token: string) =>
  apiRequest<DashboardResponse>("/api/admin/dashboard", { token });

export const getAdminLeads = (token: string) =>
  apiRequest<LeadRecord[]>("/api/admin/leads", { token });

export const updateLead = (token: string, id: number, payload: { status: string; adminNotes?: string }) =>
  apiRequest<{ success: boolean }>(`/api/admin/leads/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

export const getAdminProjects = (token: string) =>
  apiRequest<ProjectItem[]>("/api/admin/projects", { token });

export const createProject = (token: string, payload: ProjectItem) =>
  apiRequest<{ success: boolean; id: number }>("/api/admin/projects", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const updateProject = (token: string, id: number, payload: ProjectItem) =>
  apiRequest<{ success: boolean }>(`/api/admin/projects/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

export const deleteProject = (token: string, id: number) =>
  apiRequest<{ success: boolean }>(`/api/admin/projects/${id}`, {
    method: "DELETE",
    token,
  });

export const getAdminTestimonials = (token: string) =>
  apiRequest<TestimonialItem[]>("/api/admin/testimonials", { token });

export const createTestimonial = (token: string, payload: TestimonialItem) =>
  apiRequest<{ success: boolean; id: number }>("/api/admin/testimonials", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const updateTestimonial = (token: string, id: number, payload: TestimonialItem) =>
  apiRequest<{ success: boolean }>(`/api/admin/testimonials/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

export const deleteTestimonial = (token: string, id: number) =>
  apiRequest<{ success: boolean }>(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
    token,
  });

export const getGoogleReviewSyncStatus = (token: string) =>
  apiRequest<GoogleReviewSyncStatus>("/api/admin/google-reviews/status", { token });

export const syncGoogleReviews = (token: string) =>
  apiRequest<GoogleReviewSyncStatus>("/api/admin/google-reviews/sync", {
    method: "POST",
    token,
  });

export const getAdminSettings = (token: string) =>
  apiRequest<AdminSettingsResponse>("/api/admin/settings", { token });

export const updateAdminSetting = (
  token: string,
  key: keyof AdminSettingsResponse,
  value: AdminSettingsResponse[keyof AdminSettingsResponse],
) =>
  apiRequest<{ success: boolean }>(`/api/admin/settings/${key}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ value }),
  });

export const getAdminAssets = (token: string) =>
  apiRequest<AssetRecord[]>("/api/admin/assets", { token });

export const uploadAdminAsset = async (token: string, file: File, category = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  return apiRequest<{ success: boolean; asset: AssetRecord }>("/api/admin/uploads", {
    method: "POST",
    token,
    body: formData,
  });
};

export const updateAdminAsset = (token: string, id: number, payload: AssetUpdateInput) =>
  apiRequest<{ success: boolean }>(`/api/admin/assets/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

export const deleteAdminAsset = (token: string, id: number) =>
  apiRequest<{ success: boolean; removedReferences: { projects: number; testimonials: number } }>(
    `/api/admin/assets/${id}`,
    {
      method: "DELETE",
      token,
    },
  );
