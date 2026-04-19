import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps extends React.HTMLProps<HTMLElement> {
  background?: string;
  isBlackGlass?: boolean;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ className, children, background, isBlackGlass, ...props }) => {
  const blackBackground = (background || "").trim() === "bg-black";
  const shouldUseBlackGlass = isBlackGlass ?? blackBackground;

  return (
    <div
      className={cn(
        background || "bg-background",
        shouldUseBlackGlass &&
        "bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/82 border-y border-white/10"
      )}
    >
      <section
        className={cn("py-12 mx-auto max-w-7xl px-6", className)}
        {...props}
      >
        {children}
      </section>
    </div>
  );
};

export const tailwindBackgroundOptions = [
  { label: "Default", value: "bg-background" },
  { label: "White", value: "bg-white/80" },
  { label: "Gray", value: "bg-gray-50/80" },
  { label: "Zinc", value: "bg-zinc-50" },
  { label: "Black", value: "bg-black" },
  { label: "Red", value: "bg-red-50/80" },
  { label: "Orange", value: "bg-orange-50/80" },
  { label: "Yellow", value: "bg-yellow-50/80" },
  { label: "Green", value: "bg-green-50/80" },
  { label: "Lime", value: "bg-lime-50/80" },
  { label: "Emerald", value: "bg-emerald-50/80" },
  { label: "Teal", value: "bg-teal-50/80" },
  { label: "Cyan", value: "bg-cyan-50/80" },
  { label: "Blue", value: "bg-blue-50/80" },
  { label: "Sky", value: "bg-sky-50/80" },
  { label: "Indigo", value: "bg-indigo-50/80" },
  { label: "Violet", value: "bg-violet-50/80" },
  { label: "Purple", value: "bg-purple-50/80" },
  { label: "Fuchsia", value: "bg-fuchsia-50/80" },
  { label: "Pink", value: "bg-pink-50/80" },
  { label: "Rose", value: "bg-rose-50/80" },
];

export const sectionBlockSchemaField = {
  type: "string",
  label: "Background",
  name: "background",
  options: tailwindBackgroundOptions,
};

export const sectionBlackGlassSchemaField = {
  type: "boolean",
  label: "Black Glass Effect",
  name: "isBlackGlass",
  description: "Apply near-black glassmorphism regardless of background class.",
};