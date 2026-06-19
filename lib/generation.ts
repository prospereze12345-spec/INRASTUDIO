// lib/generation.ts
// Centralized types + data layer for AI-generated campaign assets
// (flyer image is handled in the editor; this covers video + captions).
//
// Swap the mock implementations below for real API calls — the shapes
// here are designed to match what the generation backend should return.

export type GenerationStatus = "pending" | "processing" | "ready" | "failed";

export interface VideoResolution {
  label: string; // e.g. "1080p"
  url: string;
  sizeMb?: number;
}

export interface VideoFormat {
  id: string; // e.g. "feed", "story"
  label: string; // e.g. "Feed Post"
  aspect: "4 / 5" | "9 / 16" | "1 / 1";
  previewUrl?: string;
  thumbnailUrl?: string;
  resolutions: VideoResolution[];
}

export interface VideoResult {
  status: GenerationStatus;
  formats: VideoFormat[];
  error?: string;
}

export interface CaptionVariant {
  id: string;
  tone: string; // e.g. "Bold", "Storytelling", "Minimal"
  text: string;
  hashtags: string[];
}

export interface CaptionResult {
  status: GenerationStatus;
  captions: CaptionVariant[];
  error?: string;
}

const CAMPAIGN_ID_KEY = "campaignId";

/** Returns the current campaign id, generating one if missing. */
export function getCampaignId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(CAMPAIGN_ID_KEY);
  if (!id) {
    id = `cmp_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(CAMPAIGN_ID_KEY, id);
  }
  return id;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the status/result of the AI video generation for a campaign.
 *
 * Backend integration:
 *   const res = await fetch(`/api/campaigns/${campaignId}/video`);
 *   if (!res.ok) throw new Error("Failed to load video");
 *   return res.json() as Promise<VideoResult>;
 *
 * Expected status flow: "processing" -> poll every few seconds -> "ready" | "failed"
 */
export async function fetchVideoResult(campaignId: string): Promise<VideoResult> {
  await wait(2500);
  return {
    status: "ready",
    formats: [
      {
        id: "feed",
        label: "Feed Post",
        aspect: "4 / 5",
        previewUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        resolutions: [
          { label: "1080p", url: "#", sizeMb: 8.2 },
          { label: "720p", url: "#", sizeMb: 4.1 },
        ],
      },
      {
        id: "story",
        label: "Story / Reels",
        aspect: "9 / 16",
        previewUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        resolutions: [
          { label: "1080p", url: "#", sizeMb: 9.6 },
          { label: "720p", url: "#", sizeMb: 4.8 },
        ],
      },
    ],
  };
}

/**
 * Fetches the AI-generated caption variants for a campaign.
 *
 * Backend integration:
 *   const res = await fetch(`/api/campaigns/${campaignId}/captions`);
 *   if (!res.ok) throw new Error("Failed to load captions");
 *   return res.json() as Promise<CaptionResult>;
 */
export async function fetchCaptionResult(campaignId: string): Promise<CaptionResult> {
  await wait(1800);
  return {
    status: "ready",
    captions: [
      {
        id: "bold",
        tone: "Bold",
        text: "Step into the new era. Limited drop, unlimited impact.",
        hashtags: ["newdrop", "limitededition", "shopnow"],
      },
      {
        id: "story",
        tone: "Storytelling",
        text: "Every great wardrobe starts with one statement piece. This is yours.",
        hashtags: ["everydaylux", "ootd", "newcollection"],
      },
      {
        id: "minimal",
        tone: "Minimal",
        text: "New in. Available now.",
        hashtags: ["newin", "shopnow"],
      },
    ],
  };
}