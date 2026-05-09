"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/app/components/course-card";
import { getCachedPrograms } from "@/lib/client-course-cache";
import type { Program } from "@/lib/program-catalog";

function formatBatchDate(value: string) {
  if (!value) return "TBA";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dt);
}

export default function FeaturedPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    let active = true;
    void getCachedPrograms().then((rows) => {
      if (!active) return;
      setPrograms(rows);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="courses"
      className="bg-mesh px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            Your global career starts here
          </p> */}
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our courses
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            Our courses are structured with a practical approach, combining theoretical knowledge + live project training to ensure you gain hands-on experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {programs.map((program, index) => {
            const programHref = `/courses/${program.id}`;
            const nextBatch = program.nextBatch;
            const enrollHref = `/enroll?course=${encodeURIComponent(program.id)}${nextBatch?.id ? `&batch=${encodeURIComponent(String(nextBatch.id))}` : ""}`;
            return (
              <CourseCard
                key={program.id}
                title={program.title}
                subtitle={program.subtitle}
                duration={program.duration}
                eligibility={program.eligibility}
                nextBatchLabel={
                  nextBatch
                    ? `${formatBatchDate(nextBatch.startDate)} · ${nextBatch.capacity > 0 ? `${nextBatch.capacity} seats` : "Seats TBA"}`
                    : "Announcing soon"
                }
                cardCoverImage={program.cardCoverImage}
                programHref={programHref}
                enrollHref={enrollHref}
                imagePriority={index < 3}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
