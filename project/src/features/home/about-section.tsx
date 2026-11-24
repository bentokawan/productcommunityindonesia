"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { MotionCard } from "@/components/motion/motion-card";
import { PinnedColumn } from "@/components/motion/pinned-column";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ABOUT_CONTENT } from "@/content/about";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const [activeMission, setActiveMission] = useState(0);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();

  const totalMissions = ABOUT_CONTENT.missions.length;

  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container || reducedMotion) return;

    const ctx = gsap.context(() => {
      const missionEls = container.querySelectorAll<HTMLElement>(
        "[data-about-mission]",
      );
      missionEls.forEach((missionEl) => {
        const raw = missionEl.dataset.aboutMission;
        const missionIdx = raw ? Number(raw) : 0;
        ScrollTrigger.create({
          trigger: missionEl,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveMission(missionIdx),
          onEnterBack: () => setActiveMission(missionIdx),
        });
      });
    }, stepsContainerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  function scrollToMission(missionIdx: number) {
    setActiveMission(missionIdx);
    const target = stepsContainerRef.current?.querySelector<HTMLElement>(
      `[data-about-mission="${missionIdx}"]`,
    );
    if (!target) return;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  const currentMissionLabel = String(activeMission + 1).padStart(2, "0");
  const totalMissionsLabel = String(totalMissions).padStart(2, "0");

  return (
    <Section tone="light" id="tentang">
      <Container>
        <PinnedColumn
          className="grid gap-10 xl:grid-cols-[520px_600px] xl:items-start xl:justify-between"
          left={
            <div>
              <SectionHeading
                align="left"
                eyebrow={ABOUT_CONTENT.eyebrow}
                title={
                  <>
                    Dari product people, <em>untuk product people.</em>
                  </>
                }
              />
              <p className="mt-5 text-lead text-(--color-fg-muted)">
                {ABOUT_CONTENT.description}
              </p>

              <div className="mt-8 hidden rounded-lg border-[1.5px] border-(--color-border) bg-stone-100/80 p-5 xl:block">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-chip tracking-[0.12em] uppercase text-(--color-accent)">
                    MISI {currentMissionLabel} DARI {totalMissionsLabel}
                  </span>
                  <span className="text-mono text-(--color-fg-muted)">
                    {currentMissionLabel} / {totalMissionsLabel}
                  </span>
                </div>

                <div
                  className="mt-3 grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${totalMissions}, minmax(0, 1fr))`,
                  }}
                >
                  {ABOUT_CONTENT.missions.map((_, missionIdx) => (
                    <button
                      key={missionIdx}
                      type="button"
                      onClick={() => scrollToMission(missionIdx)}
                      aria-label={`Lihat Misi ${missionIdx + 1}`}
                      aria-current={
                        activeMission === missionIdx ? "step" : undefined
                      }
                      className="cursor-pointer py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                    >
                      <span
                        className={cn(
                          "block h-1.5 w-full rounded-full transition-colors duration-(--duration-base)",
                          missionIdx === activeMission
                            ? "bg-brand-700"
                            : missionIdx < activeMission
                              ? "bg-brand-500"
                              : "bg-stone-200 hover:bg-stone-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          right={
            <div ref={stepsContainerRef} className="space-y-8">
              <MotionCard index={0}>
                <Card
                  tone="inverse"
                  className="border-[1.5px] border-transparent"
                >
                  <p className="text-eyebrow text-brand-500">
                    {ABOUT_CONTENT.visionEyebrow}
                  </p>
                  <p className="mt-3 text-quote text-white">
                    {ABOUT_CONTENT.vision}
                  </p>
                </Card>
              </MotionCard>

              <div>
                <p className="text-eyebrow text-(--color-accent)">
                  {ABOUT_CONTENT.missionEyebrow}
                </p>
                <ol className="mt-5 space-y-4">
                  {ABOUT_CONTENT.missions.map((mission, idx) => {
                    const missionNum = idx + 1;
                    const isActive = activeMission === idx;
                    return (
                      <MotionCard
                        key={idx}
                        as="li"
                        index={missionNum}
                        className={cn(
                          "rounded-lg border-[1.5px] p-4 transition-colors duration-(--duration-base) md:p-5",
                          isActive
                            ? "border-brand-700 bg-brand-50/55"
                            : "border-(--color-border) bg-(--color-surface)",
                        )}
                      >
                        <div
                          data-about-mission={idx}
                          className="flex items-start gap-4"
                        >
                          <span
                            className={cn(
                              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-meta font-bold transition-colors duration-(--duration-base)",
                              isActive
                                ? "bg-brand-700 text-white"
                                : "bg-brand-50 text-brand-700",
                            )}
                            aria-hidden="true"
                          >
                            {missionNum}
                          </span>
                          <span className="pt-0.5 text-body text-(--color-fg)">
                            {mission}
                          </span>
                        </div>
                      </MotionCard>
                    );
                  })}
                </ol>
              </div>
            </div>
          }
        />
      </Container>
    </Section>
  );
}
