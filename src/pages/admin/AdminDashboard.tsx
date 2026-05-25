import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  createTestimonial,
  deleteAdminAsset,
  deleteProject,
  deleteTestimonial,
  getAdminAssets,
  getAdminDashboard,
  getAdminLeads,
  getAdminProjects,
  getAdminSettings,
  getAdminTestimonials,
  type AdminSettingsResponse,
  type AssetRecord,
  type DashboardResponse,
  getGoogleReviewSyncStatus,
  type GoogleReviewSyncStatus,
  type LeadRecord,
  updateAdminAsset,
  updateAdminSetting,
  updateLead,
  updateProject,
  syncGoogleReviews,
  updateTestimonial,
  uploadAdminAsset,
} from "@/lib/api";
import { clearAdminSession, loadAdminSession } from "@/lib/admin-auth";
import {
  defaultAboutPage,
  defaultCompanyProfile,
  defaultProjects,
  resolveContentImageUrl,
  defaultSocialLinks,
  defaultTestimonials,
  type ProjectItem,
  type TestimonialItem,
} from "@/lib/default-content";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "leads", label: "Leads" },
  { id: "projects", label: "Projects CMS" },
  { id: "testimonials", label: "Testimonials CMS" },
  { id: "settings", label: "Site Settings" },
  { id: "uploads", label: "Uploads" },
] as const;

const leadStatuses = ["new", "contacted", "qualified", "won", "lost"] as const;
const assetCategoryOptions = [
  { value: "general", label: "General / Other" },
  { value: "project", label: "Project Image" },
  { value: "brochure", label: "Brochure / PDF" },
  { value: "testimonial", label: "Testimonial Image" },
] as const;

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const cardClass = "rounded-3xl border border-border bg-card p-6 shadow-sm";

const emptyProjectForm: ProjectItem = {
  title: "",
  location: "",
  capacity: "",
  co2Savings: "",
  category: "Residential",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isFeatured: true,
  isPublished: true,
};

const emptyTestimonialForm: TestimonialItem = {
  name: "",
  role: "",
  text: "",
  rating: 5,
  initials: "",
  imageUrl: "",
  sortOrder: 0,
  isPublished: true,
};

const getErrorStatus = (error: unknown) =>
  typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : null;

const toAbsoluteUrl = (fileUrl: string) =>
  fileUrl.startsWith("http") ? fileUrl : `${window.location.origin}${fileUrl}`;

const getAssetCategoryLabel = (category: string) =>
  assetCategoryOptions.find((option) => option.value === category)?.label ?? category;

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = loadAdminSession();
  const token = session?.token ?? "";
  const adminName = session?.admin.name ?? "Admin";

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [projectForm, setProjectForm] = useState<ProjectItem>(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImageInputKey, setProjectImageInputKey] = useState(0);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialItem>(emptyTestimonialForm);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [companyProfileForm, setCompanyProfileForm] = useState(defaultCompanyProfile);
  const [aboutPageForm, setAboutPageForm] = useState(defaultAboutPage);
  const [socialLinksForm, setSocialLinksForm] = useState(defaultSocialLinks);
  const [leadDrafts, setLeadDrafts] = useState<Record<number, { status: string; adminNotes: string }>>({});
  const [assetDrafts, setAssetDrafts] = useState<Record<number, { originalName: string; category: string }>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, token]);

  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => getAdminDashboard(token),
    enabled: Boolean(token),
  });

  const leadsQuery = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => getAdminLeads(token),
    enabled: Boolean(token),
  });

  const projectsQuery = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => getAdminProjects(token),
    enabled: Boolean(token),
  });

  const testimonialsQuery = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => getAdminTestimonials(token),
    enabled: Boolean(token),
  });

  const googleReviewStatusQuery = useQuery({
    queryKey: ["admin-google-reviews-status"],
    queryFn: () => getGoogleReviewSyncStatus(token),
    enabled: Boolean(token),
  });

  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => getAdminSettings(token),
    enabled: Boolean(token),
  });

  const assetsQuery = useQuery({
    queryKey: ["admin-assets"],
    queryFn: () => getAdminAssets(token),
    enabled: Boolean(token),
  });

  useEffect(() => {
    const authErrors = [
      dashboardQuery.error,
      leadsQuery.error,
      projectsQuery.error,
      testimonialsQuery.error,
      googleReviewStatusQuery.error,
      settingsQuery.error,
      assetsQuery.error,
    ];

    if (authErrors.some((error) => getErrorStatus(error) === 401)) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [
    assetsQuery.error,
    dashboardQuery.error,
    googleReviewStatusQuery.error,
    leadsQuery.error,
    navigate,
    projectsQuery.error,
    settingsQuery.error,
    testimonialsQuery.error,
  ]);

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    setCompanyProfileForm(settingsQuery.data.company_profile);
    setAboutPageForm(settingsQuery.data.about_page);
    setSocialLinksForm(settingsQuery.data.social_links);
  }, [settingsQuery.data]);

  const invalidateCmsData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-assets"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ]);
  };

  const leadMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: number; status: string; adminNotes: string }) =>
      updateLead(token, id, { status, adminNotes }),
    onSuccess: async () => {
      setFeedback("Lead updated.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-leads"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
    },
  });

  const projectMutation = useMutation({
    mutationFn: async (payload: ProjectItem) => {
      let nextPayload = payload;

      if (projectImageFile) {
        const uploadResult = await uploadAdminAsset(token, projectImageFile, "project");
        nextPayload = {
          ...payload,
          imageUrl: uploadResult.asset.file_url,
        };
      }

      return editingProjectId ? updateProject(token, editingProjectId, nextPayload) : createProject(token, nextPayload);
    },
    onSuccess: async () => {
      setFeedback(editingProjectId ? "Project updated." : "Project created.");
      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
      setProjectImageFile(null);
      setProjectImageInputKey((current) => current + 1);
      await invalidateCmsData();
    },
  });

  const testimonialMutation = useMutation({
    mutationFn: (payload: TestimonialItem) =>
      editingTestimonialId ? updateTestimonial(token, editingTestimonialId, payload) : createTestimonial(token, payload),
    onSuccess: async () => {
      setFeedback(editingTestimonialId ? "Testimonial updated." : "Testimonial created.");
      setTestimonialForm(emptyTestimonialForm);
      setEditingTestimonialId(null);
      await invalidateCmsData();
    },
  });

  const googleReviewSyncMutation = useMutation({
    mutationFn: () => syncGoogleReviews(token),
    onSuccess: async (data) => {
      setFeedback(
        data.configured
          ? `Google reviews synced. ${data.totalSynced} review(s) are now available on the site.`
          : "Google review sync is not configured yet. Add the Business Profile credentials in `.env` first.",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-google-reviews-status"] }),
        queryClient.invalidateQueries({ queryKey: ["public-content"] }),
      ]);
    },
  });

  const settingsMutation = useMutation({
    mutationFn: ({ key, value }: { key: keyof AdminSettingsResponse; value: AdminSettingsResponse[keyof AdminSettingsResponse] }) =>
      updateAdminSetting(token, key, value),
    onSuccess: async () => {
      setFeedback("Settings saved.");
      await invalidateCmsData();
    },
  });

  const assetUpdateMutation = useMutation({
    mutationFn: ({ id, originalName, category }: { id: number; originalName: string; category: string }) =>
      updateAdminAsset(token, id, { originalName, category }),
    onSuccess: async (_data, variables) => {
      setFeedback("Asset updated.");
      setAssetDrafts((current) => {
        const next = { ...current };
        delete next[variables.id];
        return next;
      });
      await invalidateCmsData();
    },
  });

  const assetDeleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminAsset(token, id),
    onSuccess: async (data, id) => {
      const cleanupDetails = [];

      if (data.removedReferences.projects > 0) {
        cleanupDetails.push(`${data.removedReferences.projects} project`);
      }

      if (data.removedReferences.testimonials > 0) {
        cleanupDetails.push(`${data.removedReferences.testimonials} testimonial`);
      }

      setFeedback(
        cleanupDetails.length > 0
          ? `Asset deleted. Removed from ${cleanupDetails.join(" and ")} records.`
          : "Asset deleted.",
      );
      setAssetDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      await invalidateCmsData();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, category }: { file: File; category: string }) => uploadAdminAsset(token, file, category),
    onSuccess: async () => {
      setFeedback("File uploaded.");
      setSelectedFile(null);
      setUploadInputKey((current) => current + 1);
      await queryClient.invalidateQueries({ queryKey: ["admin-assets"] });
    },
  });

  const overview = dashboardQuery.data as DashboardResponse | undefined;
  const leads = (leadsQuery.data as LeadRecord[] | undefined) ?? [];
  const projects = (projectsQuery.data as ProjectItem[] | undefined) ?? defaultProjects;
  const testimonials = (testimonialsQuery.data as TestimonialItem[] | undefined) ?? defaultTestimonials;
  const assets = (assetsQuery.data as AssetRecord[] | undefined) ?? [];
  const googleReviewStatus = googleReviewStatusQuery.data as GoogleReviewSyncStatus | undefined;

  const topProjectImages = useMemo(
    () => assets.filter((asset) => asset.category === "project" || asset.category === "brochure"),
    [assets],
  );

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  const handleLeadSave = (lead: LeadRecord) => {
    const draft = leadDrafts[lead.id] || {
      status: lead.status,
      adminNotes: lead.admin_notes || "",
    };

    leadMutation.mutate({
      id: lead.id,
      status: draft.status,
      adminNotes: draft.adminNotes,
    });
  };

  const handleProjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    projectMutation.mutate(projectForm);
  };

  const handleTestimonialSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    testimonialMutation.mutate(testimonialForm);
  };

  const saveUpload = () => {
    if (!selectedFile) {
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      category: uploadCategory,
    });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">SUNTECH Admin</p>
            <h1 className="mt-2 text-3xl font-extrabold text-foreground">Welcome back, {adminName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage leads, projects, testimonials, settings, uploads, and analytics from one place.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              View Site
            </a>
            <button onClick={handleLogout} className="rounded-xl bg-solar-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-solar-green/90">
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {feedback ? (
          <div className="mb-6 rounded-2xl border border-solar-green/20 bg-solar-green/10 px-4 py-3 text-sm text-solar-green">
            {feedback}
          </div>
        ) : null}

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? "bg-solar-green text-white" : "bg-card text-muted-foreground hover:bg-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-8">
            <SectionTitle title="Overview" subtitle="High-level business signals from leads, content, and page traffic." />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total Leads", value: overview?.stats.totalLeads ?? 0 },
                { label: "New Leads", value: overview?.stats.newLeads ?? 0 },
                { label: "Published Projects", value: overview?.stats.totalProjects ?? 0 },
                { label: "Newsletter Subscribers", value: overview?.stats.totalSubscribers ?? 0 },
              ].map((item) => (
                <div key={item.label} className={cardClass}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-4xl font-extrabold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className={`${cardClass} lg:col-span-2`}>
                <SectionTitle title="Recent Leads" subtitle="Most recent website enquiries." />
                <div className="space-y-4">
                  {(overview?.recentLeads ?? []).map((lead) => (
                    <div key={lead.id} className="rounded-2xl border border-border px-4 py-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.phone}{lead.email ? ` • ${lead.email}` : ""}</p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {overview?.recentLeads?.length ? null : <p className="text-sm text-muted-foreground">No leads yet.</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div className={cardClass}>
                  <SectionTitle title="Top Pages" subtitle="Tracked page views." />
                  <div className="space-y-3">
                    {(overview?.topPages ?? []).map((page) => (
                      <div key={page.path} className="flex items-center justify-between text-sm">
                        <span className="truncate pr-4 text-foreground">{page.path}</span>
                        <span className="font-semibold text-primary">{page.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cardClass}>
                  <SectionTitle title="Lead Sources" subtitle="UTM-based attribution summary." />
                  <div className="space-y-3">
                    {(overview?.leadSources ?? []).map((item) => (
                      <div key={item.source} className="flex items-center justify-between text-sm">
                        <span className="truncate pr-4 text-foreground">{item.source}</span>
                        <span className="font-semibold text-primary">{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "leads" ? (
          <div className="space-y-6">
            <SectionTitle title="Lead Inbox" subtitle="Qualify and track every enquiry without leaving the dashboard." />
            <div className="space-y-4">
              {leads.map((lead) => {
                const draft = leadDrafts[lead.id] || { status: lead.status, adminNotes: lead.admin_notes || "" };

                return (
                  <div key={lead.id} className={cardClass}>
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-foreground">{lead.name}</h3>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {lead.status}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <p><span className="font-semibold text-foreground">Phone:</span> {lead.phone}</p>
                          <p><span className="font-semibold text-foreground">Email:</span> {lead.email || "Not provided"}</p>
                          <p><span className="font-semibold text-foreground">City:</span> {lead.city || "Not provided"}</p>
                          <p><span className="font-semibold text-foreground">PIN Code:</span> {lead.pin_code || "Not provided"}</p>
                          <p><span className="font-semibold text-foreground">Monthly Bill:</span> {lead.monthly_bill ?? "Not provided"}</p>
                          <p><span className="font-semibold text-foreground">Source Page:</span> {lead.source_page || "Unknown"}</p>
                          <p><span className="font-semibold text-foreground">UTM:</span> {lead.utm_source || "Direct"} / {lead.utm_medium || "-"} / {lead.utm_campaign || "-"}</p>
                          <p><span className="font-semibold text-foreground">Message:</span> {lead.message || "No message added."}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</label>
                          <select
                            value={draft.status}
                            onChange={(event) =>
                              setLeadDrafts((current) => ({
                                ...current,
                                [lead.id]: {
                                  status: event.target.value,
                                  adminNotes: current[lead.id]?.adminNotes ?? draft.adminNotes,
                                },
                              }))
                            }
                            className={inputClass}
                          >
                            {leadStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Internal Notes</label>
                          <textarea
                            value={draft.adminNotes}
                            onChange={(event) =>
                              setLeadDrafts((current) => ({
                                ...current,
                                [lead.id]: {
                                  status: current[lead.id]?.status ?? draft.status,
                                  adminNotes: event.target.value,
                                },
                              }))
                            }
                            className={textareaClass}
                            placeholder="Add follow-up notes, owner, or next action"
                          />
                        </div>

                        <button
                          onClick={() => handleLeadSave(lead)}
                          className="w-full rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90"
                        >
                          Save Lead Update
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {activeTab === "projects" ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_1.2fr]">
            <div className={cardClass}>
              <SectionTitle title={editingProjectId ? "Edit Project" : "Add Project"} subtitle="The seeded projects remain. New projects and edits layer on top of them." />
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input className={inputClass} placeholder="Project title" value={projectForm.title || ""} onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} placeholder="Location" value={projectForm.location || ""} onChange={(event) => setProjectForm((current) => ({ ...current, location: event.target.value }))} required />
                  <input className={inputClass} placeholder="Category" value={projectForm.category || ""} onChange={(event) => setProjectForm((current) => ({ ...current, category: event.target.value }))} required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} placeholder="Capacity" value={projectForm.capacity || ""} onChange={(event) => setProjectForm((current) => ({ ...current, capacity: event.target.value }))} required />
                  <input className={inputClass} placeholder="CO2 savings" value={projectForm.co2Savings || ""} onChange={(event) => setProjectForm((current) => ({ ...current, co2Savings: event.target.value }))} required />
                </div>
                <textarea className={textareaClass} placeholder="Project description" value={projectForm.description || ""} onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))} />
                <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Project image</p>
                      <p className="mt-1 text-xs text-muted-foreground">Choose an image file and it will upload automatically when you save this project.</p>
                    </div>
                    {projectForm.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProjectForm((current) => ({ ...current, imageUrl: "" }));
                          setProjectImageFile(null);
                          setProjectImageInputKey((current) => current + 1);
                        }}
                        className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-background"
                      >
                        Remove Image
                      </button>
                    ) : null}
                  </div>

                  <input
                    key={projectImageInputKey}
                    className={inputClass}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setProjectImageFile(event.target.files?.[0] ?? null)}
                  />

                  {projectImageFile ? (
                    <p className="text-xs text-muted-foreground">Selected file: {projectImageFile.name}</p>
                  ) : projectForm.imageUrl ? (
                    <p className="text-xs text-muted-foreground">Current image: {projectForm.imageUrl}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No image selected. Leaving this empty will keep the default project artwork.</p>
                  )}

                  {projectForm.imageUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-background">
                      <img src={resolveContentImageUrl(projectForm.imageUrl)} alt={projectForm.title || "Project preview"} className="h-40 w-full object-cover" />
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <input className={inputClass} type="number" min={0} placeholder="Sort order" value={projectForm.sortOrder ?? 0} onChange={(event) => setProjectForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
                  <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-foreground">
                    <input type="checkbox" checked={projectForm.isFeatured !== false} onChange={(event) => setProjectForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                    Featured
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-foreground">
                    <input type="checkbox" checked={projectForm.isPublished !== false} onChange={(event) => setProjectForm((current) => ({ ...current, isPublished: event.target.checked }))} />
                    Published
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={projectMutation.isPending} className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90 disabled:cursor-not-allowed disabled:opacity-70">
                    {projectMutation.isPending
                      ? projectImageFile
                        ? "Uploading Image..."
                        : "Saving..."
                      : editingProjectId
                        ? "Save Project"
                        : "Create Project"}
                  </button>
                  {editingProjectId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm(emptyProjectForm);
                        setProjectImageFile(null);
                        setProjectImageInputKey((current) => current + 1);
                      }}
                      className="rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className={cardClass}>
              <SectionTitle title="Existing Projects" subtitle="Edit or remove records while keeping the current project catalog intact." />
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={`${project.id ?? project.title}-${project.sortOrder ?? 0}`} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.location} • {project.category} • {project.capacity}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{project.description || "No description added."}</p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Image: {project.imageUrl || "Default"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setEditingProjectId(project.id ?? null);
                            setProjectImageFile(null);
                            setProjectImageInputKey((current) => current + 1);
                            setProjectForm({
                              ...emptyProjectForm,
                              ...project,
                            });
                          }}
                          className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                        >
                          Edit
                        </button>
                        {project.id ? (
                          <button
                            onClick={async () => {
                              await deleteProject(token, project.id!);
                              setFeedback("Project deleted.");
                              await invalidateCmsData();
                            }}
                            className="rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "testimonials" ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_1.2fr]">
            <div className={`${cardClass} xl:col-span-2`}>
              <SectionTitle
                title="Google Reviews Sync"
                subtitle="Import the old reviews from your verified Google Business Profile and keep new reviews appearing on the website automatically."
              />
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {googleReviewStatus?.configured ? "Configured" : "Not configured"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Auto Sync</p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {googleReviewStatus?.autoSync ? "Enabled" : "Manual only"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Imported Reviews</p>
                  <p className="mt-2 text-lg font-bold text-foreground">{googleReviewStatus?.totalSynced ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Last Synced</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {googleReviewStatus?.lastSyncedAt ? new Date(googleReviewStatus.lastSyncedAt).toLocaleString() : "Never"}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                {googleReviewStatus?.configured ? (
                  <>
                    <p>
                      Connected location: <span className="font-semibold text-foreground">{googleReviewStatus.locationName}</span>
                    </p>
                    <p className="mt-2">
                      Use the sync button below to pull your latest Google reviews into the website. New Google reviews will keep appearing here based on your auto-sync settings.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Add `GOOGLE_BUSINESS_PROFILE_LOCATION_NAME`, `GOOGLE_BUSINESS_PROFILE_CLIENT_ID`,
                      `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET`, and `GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN` in `.env`
                      to start syncing Google reviews.
                    </p>
                    <div className="mt-3 rounded-2xl border border-dashed border-border bg-background/80 p-4">
                      <p className="font-semibold text-foreground">What to connect</p>
                      <div className="mt-2 space-y-2">
                        <p>1. Request Google Business Profile API access for your verified business location.</p>
                        <p>2. Create OAuth credentials and a refresh token for that Google account.</p>
                        <p>3. Restart the backend, then click <span className="font-semibold text-foreground">Sync Google Reviews Now</span>.</p>
                      </div>
                    </div>
                    <p className="mt-3">
                      The Google review page URL in company settings is only used for the public "View on Google" button. It does not import review data on its own.
                    </p>
                  </>
                )}
                {googleReviewStatus?.lastError ? (
                  <p className="mt-2 text-red-600">Last sync error: {googleReviewStatus.lastError}</p>
                ) : null}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => googleReviewSyncMutation.mutate()}
                  disabled={googleReviewSyncMutation.isPending}
                  className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {googleReviewSyncMutation.isPending ? "Syncing..." : "Sync Google Reviews Now"}
                </button>
              </div>
            </div>

            <div className={cardClass}>
              <SectionTitle title={editingTestimonialId ? "Edit Testimonial" : "Add Testimonial"} subtitle="Manage the manual reviews shown on the site in addition to synced Google reviews." />
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <input className={inputClass} placeholder="Customer name" value={testimonialForm.name || ""} onChange={(event) => setTestimonialForm((current) => ({ ...current, name: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} placeholder="Role / company" value={testimonialForm.role || ""} onChange={(event) => setTestimonialForm((current) => ({ ...current, role: event.target.value }))} required />
                  <input className={inputClass} placeholder="Initials" value={testimonialForm.initials || ""} onChange={(event) => setTestimonialForm((current) => ({ ...current, initials: event.target.value }))} />
                </div>
                <textarea className={textareaClass} placeholder="Customer review" value={testimonialForm.text || ""} onChange={(event) => setTestimonialForm((current) => ({ ...current, text: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-3">
                  <input className={inputClass} type="number" min={1} max={5} placeholder="Rating" value={testimonialForm.rating ?? 5} onChange={(event) => setTestimonialForm((current) => ({ ...current, rating: Number(event.target.value) }))} />
                  <input className={inputClass} type="number" min={0} placeholder="Sort order" value={testimonialForm.sortOrder ?? 0} onChange={(event) => setTestimonialForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
                  <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-foreground">
                    <input type="checkbox" checked={testimonialForm.isPublished !== false} onChange={(event) => setTestimonialForm((current) => ({ ...current, isPublished: event.target.checked }))} />
                    Published
                  </label>
                </div>
                <input className={inputClass} placeholder="Optional image URL" value={testimonialForm.imageUrl || ""} onChange={(event) => setTestimonialForm((current) => ({ ...current, imageUrl: event.target.value }))} />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90">
                    {editingTestimonialId ? "Save Testimonial" : "Create Testimonial"}
                  </button>
                  {editingTestimonialId ? (
                    <button type="button" onClick={() => { setEditingTestimonialId(null); setTestimonialForm(emptyTestimonialForm); }} className="rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted">
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className={cardClass}>
              <SectionTitle title="Manual Testimonials" subtitle="These manual testimonials are displayed together with synced Google reviews on the public site." />
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={`${testimonial.id ?? testimonial.name}-${testimonial.sortOrder ?? 0}`} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.rating}/5</p>
                        <p className="mt-2 text-sm text-muted-foreground">{testimonial.text}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setEditingTestimonialId(testimonial.id ?? null);
                            setTestimonialForm({
                              ...emptyTestimonialForm,
                              ...testimonial,
                            });
                          }}
                          className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                        >
                          Edit
                        </button>
                        {testimonial.id ? (
                          <button
                            onClick={async () => {
                              await deleteTestimonial(token, testimonial.id!);
                              setFeedback("Testimonial deleted.");
                              await invalidateCmsData();
                            }}
                            className="rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={cardClass}>
              <SectionTitle title="Company Profile" subtitle="Header, footer, contact page, and notifications use these values." />
              <div className="space-y-4">
                <input className={inputClass} placeholder="Company name" value={companyProfileForm.name} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, name: event.target.value }))} />
                <input className={inputClass} placeholder="Short name" value={companyProfileForm.shortName} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, shortName: event.target.value }))} />
                <input className={inputClass} type="number" placeholder="Year established" value={companyProfileForm.yearEstablished} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, yearEstablished: Number(event.target.value) }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} placeholder="Phone" value={companyProfileForm.phone} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, phone: event.target.value }))} />
                  <input className={inputClass} placeholder="Alternate phone" value={companyProfileForm.alternatePhone || ""} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, alternatePhone: event.target.value }))} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} placeholder="WhatsApp" value={companyProfileForm.whatsapp} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, whatsapp: event.target.value }))} />
                  <input className={inputClass} placeholder="Public email" value={companyProfileForm.email} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, email: event.target.value }))} />
                </div>
                <input className={inputClass} placeholder="Notification email" value={companyProfileForm.notificationsEmail} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, notificationsEmail: event.target.value }))} />
                <input className={inputClass} placeholder="Address" value={companyProfileForm.address} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, address: event.target.value }))} />
                <input className={inputClass} placeholder="Working hours" value={companyProfileForm.workingHours} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, workingHours: event.target.value }))} />
                <input className={inputClass} placeholder="Google Maps embed URL" value={companyProfileForm.mapEmbedUrl} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, mapEmbedUrl: event.target.value }))} />
                <input className={inputClass} placeholder="Google review page URL" value={companyProfileForm.googleReviewUrl || ""} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, googleReviewUrl: event.target.value }))} />
                <p className="text-sm text-muted-foreground">
                  This is the public Google page visitors open when they click "View on Google". Importing reviews still requires the Google Business Profile credentials in `.env`.
                </p>
                <textarea className={textareaClass} placeholder="Footer blurb" value={companyProfileForm.footerBlurb} onChange={(event) => setCompanyProfileForm((current) => ({ ...current, footerBlurb: event.target.value }))} />
                <button
                  onClick={() => settingsMutation.mutate({ key: "company_profile", value: companyProfileForm })}
                  className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90"
                >
                  Save Company Profile
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className={cardClass}>
                <SectionTitle title="About Page Copy" subtitle="Manage the story content shown on the About page." />
                <div className="space-y-4">
                  <input className={inputClass} placeholder="Story title" value={aboutPageForm.storyTitle} onChange={(event) => setAboutPageForm((current) => ({ ...current, storyTitle: event.target.value }))} />
                  <textarea className={textareaClass} placeholder="Story paragraph 1" value={aboutPageForm.storyParagraph1} onChange={(event) => setAboutPageForm((current) => ({ ...current, storyParagraph1: event.target.value }))} />
                  <textarea className={textareaClass} placeholder="Story paragraph 2" value={aboutPageForm.storyParagraph2} onChange={(event) => setAboutPageForm((current) => ({ ...current, storyParagraph2: event.target.value }))} />
                  <button
                    onClick={() => settingsMutation.mutate({ key: "about_page", value: aboutPageForm })}
                    className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90"
                  >
                    Save About Content
                  </button>
                </div>
              </div>

              <div className={cardClass}>
                <SectionTitle title="Social Links" subtitle="Footer social buttons use these links when provided." />
                <div className="space-y-4">
                  <input className={inputClass} placeholder="Facebook URL" value={socialLinksForm.facebook || ""} onChange={(event) => setSocialLinksForm((current) => ({ ...current, facebook: event.target.value }))} />
                  <input className={inputClass} placeholder="Instagram URL" value={socialLinksForm.instagram || ""} onChange={(event) => setSocialLinksForm((current) => ({ ...current, instagram: event.target.value }))} />
                  <input className={inputClass} placeholder="LinkedIn URL" value={socialLinksForm.linkedin || ""} onChange={(event) => setSocialLinksForm((current) => ({ ...current, linkedin: event.target.value }))} />
                  <input className={inputClass} placeholder="YouTube URL" value={socialLinksForm.youtube || ""} onChange={(event) => setSocialLinksForm((current) => ({ ...current, youtube: event.target.value }))} />
                  <button
                    onClick={() => settingsMutation.mutate({ key: "social_links", value: socialLinksForm })}
                    className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90"
                  >
                    Save Social Links
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "uploads" ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={cardClass}>
              <SectionTitle title="Upload Asset" subtitle="Store project photos, brochures, or other CMS assets for reuse and manage them from this tab." />
              <div className="space-y-4">
                <input key={uploadInputKey} type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} className={inputClass} />
                <select value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value)} className={inputClass}>
                  {assetCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  `General / Other` means the file is uploaded and stored in the library, but not specifically tagged for a project, brochure, or testimonial yet.
                </p>
                <button onClick={saveUpload} className="rounded-xl bg-solar-green px-4 py-3 font-semibold text-white transition-colors hover:bg-solar-green/90">
                  Upload File
                </button>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground">Quick image URLs</p>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {topProjectImages.slice(0, 5).map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => navigator.clipboard.writeText(asset.file_url)}
                      className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left hover:bg-muted"
                    >
                      {asset.file_url}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <SectionTitle title="Uploaded Assets" subtitle="Edit category/name, copy the file path, open the asset, or delete it from here." />
              <div className="space-y-4">
                {assets.map((asset) => {
                  const draft = assetDrafts[asset.id] || {
                    originalName: asset.original_name,
                    category: asset.category,
                  };
                  const isUpdating = assetUpdateMutation.isPending && assetUpdateMutation.variables?.id === asset.id;
                  const isDeleting = assetDeleteMutation.isPending && assetDeleteMutation.variables === asset.id;

                  return (
                    <div key={asset.id} className="grid gap-4 rounded-2xl border border-border p-4 lg:grid-cols-[120px_1fr]">
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                      {asset.mime_type.startsWith("image/") ? (
                        <img src={toAbsoluteUrl(asset.file_url)} alt={asset.original_name} className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 items-center justify-center px-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {getAssetCategoryLabel(asset.category)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">{asset.original_name}</p>
                      <p className="text-sm text-muted-foreground">{asset.category} • {(asset.size_bytes / 1024).toFixed(1)} KB</p>
                      <div className="rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{asset.file_url}</div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => navigator.clipboard.writeText(asset.file_url)} className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
                          Copy Relative URL
                        </button>
                        <a href={toAbsoluteUrl(asset.file_url)} target="_blank" rel="noreferrer" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
                          Open File
                        </a>
                      </div>
                      <div className="grid gap-3 md:grid-cols-[1.4fr_0.9fr]">
                        <input
                          className={inputClass}
                          value={draft.originalName}
                          onChange={(event) =>
                            setAssetDrafts((current) => ({
                              ...current,
                              [asset.id]: {
                                originalName: event.target.value,
                                category: current[asset.id]?.category ?? draft.category,
                              },
                            }))
                          }
                          placeholder="File name"
                        />
                        <select
                          className={inputClass}
                          value={draft.category}
                          onChange={(event) =>
                            setAssetDrafts((current) => ({
                              ...current,
                              [asset.id]: {
                                originalName: current[asset.id]?.originalName ?? draft.originalName,
                                category: event.target.value,
                              },
                            }))
                          }
                        >
                          {assetCategoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            assetUpdateMutation.mutate({
                              id: asset.id,
                              originalName: draft.originalName.trim(),
                              category: draft.category,
                            })
                          }
                          disabled={isUpdating || isDeleting || !draft.originalName.trim()}
                          className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Delete this uploaded file? If it is used in a project or testimonial, that image reference will be cleared.",
                              )
                            ) {
                              assetDeleteMutation.mutate(asset.id);
                            }
                          }}
                          disabled={isUpdating || isDeleting}
                          className="rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
                {assets.length ? null : <p className="text-sm text-muted-foreground">No uploaded assets yet.</p>}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
