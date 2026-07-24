// ─────────────────────────────────────────────────────────────────────────────
// Campaign API — /api/campaign/ endpoints
// ─────────────────────────────────────────────────────────────────────────────

export type JobStatus = "pending" | "processing" | "done" | "error";

export interface JobCreatedResponse {
  job_id: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
}

export interface Caption {
  platform: string;
  text: string;
}
export interface JobResultResponse {
  job_id: string;
  status: "done";
  png_url: string;
  captions: Caption[];
  video_url: string | null;
  // The API also returns the original flyer config (text/colors/brand)
  // so the editor can be fully reconstructed later — type it explicitly
  // instead of leaning on `as any` everywhere it's consumed.
  flyer?: {
    headline?: string;
    subheadline?: string;
    subtext?: string;
    cta?: string;
    ctaText?: string;
    badgeText?: string;
    brand_name?: string;
    brandName?: string;
    price_text?: string;
    name?: string;
    colors?: { primary: string; secondary: string; accent: string };
  };
  template_category?: string;
}

// ─── 3b. Fetch by id + cache (used when opening an existing campaign,
//         e.g. from the dashboard's "Recent Campaigns" list) ────────────────

export async function fetchJobById(jobId: string): Promise<JobResultResponse> {
  const result = await getJobResult(jobId);
  saveJobResult(result); // cache it so subsequent loads in this session are instant
  return result;
}
// ─── helpers ─────────────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── 1. Create job (POST /api/campaign/generate/) ────────────────────────────
// Accepts a File/Blob (the raw product image).
// Returns { job_id }.

export async function createCampaignJob(imageFile: File | Blob): Promise<JobCreatedResponse> {
  const form = new FormData();
  form.append("image", imageFile);

  const res = await fetch("/api/campaign/generate/", {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? `Job creation failed (${res.status})`);
  }

  return res.json();
}

// ─── 2. Poll job status (GET /api/campaign/status/<job_id>/) ─────────────────

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`/api/campaign/status/${jobId}/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Status check failed (${res.status})`);
  return res.json();
}

// ─── 3. Fetch result (GET /api/campaign/result/<job_id>/) ────────────────────

export async function getJobResult(jobId: string): Promise<JobResultResponse> {
  const res = await fetch(`/api/campaign/result/${jobId}/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Result fetch failed (${res.status})`);
  return res.json();
}

// ─── 4. Poll-until-done helper ───────────────────────────────────────────────
// Polls every `intervalMs` (default 2 s) until status is "done" or "error",
// or until `maxAttempts` is reached (default 60 = 2 min).
// Calls `onStatus` each tick so callers can show progress.

export async function pollUntilDone(
  jobId: string,
  opts?: {
    intervalMs?: number;
    maxAttempts?: number;
    onStatus?: (status: JobStatus) => void;
  }
): Promise<JobResultResponse> {
const { intervalMs = 3000, maxAttempts = 240, onStatus } = opts ?? {};
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await delay(attempt === 0 ? 500 : intervalMs); // first check is quick

    const { status } = await getJobStatus(jobId);
    onStatus?.(status);

    if (status === "done") return getJobResult(jobId);
    if (status === "error") throw new Error("Job failed on the server");
  }

  throw new Error("Timed out waiting for job to complete");
}

// ─── SessionStorage keys ─────────────────────────────────────────────────────
// We upgrade from storing a blob URL to storing the job result so every page
// can access the bg-removed image URL, captions and video.

const SS_JOB_ID  = "campaign_job_id";
const SS_RESULT  = "campaign_result";

export function saveJobResult(result: JobResultResponse): void {
  sessionStorage.setItem(SS_JOB_ID, result.job_id);
  sessionStorage.setItem(SS_RESULT, JSON.stringify(result));
  // Keep legacy key so existing template page code keeps working
  sessionStorage.setItem("campaignImage", result.png_url);
}

export function loadJobResult(): JobResultResponse | null {
  const raw = sessionStorage.getItem(SS_RESULT);
  if (!raw) return null;
  try { return JSON.parse(raw) as JobResultResponse; } catch { return null; }
}

export function clearJobResult(): void {
  sessionStorage.removeItem(SS_JOB_ID);
  sessionStorage.removeItem(SS_RESULT);
  sessionStorage.removeItem("campaignImage");
}

// ─── util ─────────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}