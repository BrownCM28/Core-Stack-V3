import { Hero } from "@/components/home/Hero";
import { FeaturedJobsStrip } from "@/components/home/FeaturedJobsStrip";
import { LatestJobs } from "@/components/home/LatestJobs";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { CategoriesStrip } from "@/components/home/CategoriesStrip";
import { Footer } from "@/components/Footer";
import { FEATURED_JOBS, LATEST_JOBS, ACTIVITY } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* 1. Hero */}
      <Hero />

      {/* 2. Featured jobs horizontal strip */}
      <FeaturedJobsStrip jobs={FEATURED_JOBS} />

      {/* 3. Two-column: latest jobs + activity feed */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <LatestJobs jobs={LATEST_JOBS} />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed events={ACTIVITY} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories strip */}
      <CategoriesStrip />

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
