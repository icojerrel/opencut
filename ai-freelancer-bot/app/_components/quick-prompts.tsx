"use client";

import { Button } from "@/components/ui/button";

const PROMPTS = [
  {
    label: "Profiel instellen",
    text: "Stel mijn profiel in: ik ben Next.js developer, 5 jaar ervaring, skills Next.js React TypeScript, €85/uur.",
  },
  {
    label: "Jobs zoeken",
    text: "Welke opdrachten passen het best bij mijn profiel?",
  },
  {
    label: "Live jobs",
    text: "Haal live remote developer jobs op van Jobicy en Remotive.",
  },
  {
    label: "Proposal schrijven",
    text: "Schrijf een proposal voor job-001 en sla het op.",
  },
  {
    label: "Tarief berekenen",
    text: "Wat moet ik vragen voor een medium complex AI integratie project van 40 uur?",
  },
  {
    label: "Video offerte",
    text: "Bereken een offerte voor 5 YouTube Shorts per week, standard, met captions.",
  },
] as const;

export function QuickPrompts({
  disabled,
  onSelect,
}: {
  readonly disabled: boolean;
  readonly onSelect: (text: string) => void;
}) {
  return (
    <div className="flex w-full max-w-3xl flex-wrap justify-center gap-2 px-2">
      {PROMPTS.map(({ label, text }) => (
        <Button
          key={label}
          className="rounded-full text-xs"
          disabled={disabled}
          onClick={() => onSelect(text)}
          size="sm"
          type="button"
          variant="outline"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
