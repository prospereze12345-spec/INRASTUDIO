
import { apiFetch, ApiError } from "@/lib/auth";
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

// ─── 1. Create job (POST /api/campaign/generate/) ────────────────────────────
export async function createCampaignJob(imageFile: File | Blob): Promise<JobCreatedResponse> {
  const form = new FormData();
  form.append("image", imageFile);

  // apiFetch already skips the Content-Type header for FormData bodies
  // and attaches/refreshes the auth token automatically.
  return apiFetch<JobCreatedResponse>("/api/campaign/generate", {
    method: "POST",
    body: form,
  });
}

// ─── 2. Poll job status (GET /api/campaign/status/<job_id>/) ─────────────────
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiFetch<JobStatusResponse>(`/api/campaign/status/${jobId}`);
}

// ─── 3. Fetch result (GET /api/campaign/result/<job_id>/) ────────────────────
export async function getJobResult(jobId: string): Promise<JobResultResponse> {
  return apiFetch<JobResultResponse>(`/api/campaign/result/${jobId}`);
}

// ─── 3b. Fetch by id + cache (used when opening an existing campaign,
//         e.g. from the dashboard's "Recent Campaigns" list) ────────────────
export async function fetchJobById(jobId: string): Promise<JobResultResponse> {
  const result = await getJobResult(jobId);
  saveJobResult(result);
  return result;
}

// ─── 4. Poll-until-done helper ───────────────────────────────────────────────
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
    await delay(attempt === 0 ? 500 : intervalMs);

    const { status } = await getJobStatus(jobId);
    onStatus?.(status);

    if (status === "done") return getJobResult(jobId);
    if (status === "error") throw new Error("Job failed on the server");
  }

  throw new Error("Timed out waiting for job to complete");
}

// ─── Cache layer ──────────────────────────────────────────────────────────────
// sessionStorage doesn't survive mobile in-app browsers, PWA relaunches, or
// iOS backgrounding as reliably as desktop tabs. We keep sessionStorage as
// the fast path but fall back to localStorage (with a TTL so stale campaign
// data doesn't linger indefinitely) for the cases sessionStorage misses.
const SS_JOB_ID = "campaign_job_id";
const SS_RESULT = "campaign_result";
const LS_RESULT_PREFIX = "campaign_result_cache:";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 min — long enough to survive an app
                                      // relaunch mid-edit, short enough to avoid
                                      // showing a genuinely stale campaign.

type CachedEntry = { result: JobResultResponse; cachedAt: number };

export function saveJobResult(result: JobResultResponse): void {
  sessionStorage.setItem(SS_JOB_ID, result.job_id);
  sessionStorage.setItem(SS_RESULT, JSON.stringify(result));
  sessionStorage.setItem("campaignImage", result.png_url); // legacy key

  try {
    const entry: CachedEntry = { result, cachedAt: Date.now() };
    localStorage.setItem(`${LS_RESULT_PREFIX}${result.job_id}`, JSON.stringify(entry));
  } catch {
    // localStorage full/unavailable (private mode etc.) — sessionStorage still works
  }
}

export function loadJobResult(jobId?: string | null): JobResultResponse | null {
  const raw = sessionStorage.getItem(SS_RESULT);
  if (raw) {
    try {
      const cached = JSON.parse(raw) as JobResultResponse;
      if (!jobId || cached.job_id === jobId) return cached;
    } catch {
      /* fall through to localStorage */
    }
  }

  if (!jobId) return null;

  try {
    const raw2 = localStorage.getItem(`${LS_RESULT_PREFIX}${jobId}`);
    if (!raw2) return null;
    const entry = JSON.parse(raw2) as CachedEntry;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(`${LS_RESULT_PREFIX}${jobId}`);
      return null;
    }
    return entry.result;
  } catch {
    return null;
  }
}

export function clearJobResult(jobId?: string | null): void {
  sessionStorage.removeItem(SS_JOB_ID);
  sessionStorage.removeItem(SS_RESULT);
  sessionStorage.removeItem("campaignImage");
  if (jobId) {
    try { localStorage.removeItem(`${LS_RESULT_PREFIX}${jobId}`); } catch {}
  }
}

// ─── util ─────────────────────────────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { ApiError };