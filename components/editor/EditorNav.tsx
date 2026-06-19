"use client";

import Link from "next/link";
import { LayoutTemplate, Video, MessageSquare } from "lucide-react";

const TABS = [
  { id: "flyer", label: "Flyer", href: "/editor", icon: LayoutTemplate },
  { id: "video", label: "Video", href: "/editor/video", icon: Video },
  { id: "caption", label: "Captions", href: "/editor/caption", icon: MessageSquare },
] as const;

export function EditorNav({ active }: { active: "flyer" | "video" | "caption" }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
              isActive
                ? "bg-cyan-400 text-[#0a1128] font-bold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}