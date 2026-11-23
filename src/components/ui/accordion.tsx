"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenAll?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenAll = true,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpenAll ? items.map((item) => item.id) : []),
  );

  function toggleItem(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <Card key={item.id} tone="muted" className="p-6 md:p-7">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
              >
                <span className="text-faq-q text-ink-900">{item.question}</span>
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-out)",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pt-3 text-body-sm text-stone-500">
                  {item.answer}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
