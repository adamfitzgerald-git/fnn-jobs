import { prisma } from "@/lib/prisma";
import { EmployerCard } from "@/components/employers/EmployerCard";
import { JobCard } from "@/components/jobs/JobCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [employers, jobs] = await Promise.all([
    prisma.employer.findMany({
      where: { status: "PUBLISHED" },
      include: {
        _count: {
          select: {
            jobs: { where: { status: "PUBLISHED", closingDate: { gte: new Date() } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.job.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ closingDate: null }, { closingDate: { gte: new Date() } }],
      },
      include: {
        employer: { select: { name: true, slug: true, logo: true, rapTier: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
              Connecting First Nations jobseekers with purpose-driven employers
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Explore rich employer profiles, discover meaningful roles, and connect
              directly with organisations committed to reconciliation and Indigenous employment.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <form action="/jobs" method="get" className="flex-1 flex gap-2">
                <input
                  type="search"
                  name="q"
                  placeholder="Search jobs, employers, locations..."
                  className="flex-1 rounded-md px-4 py-3 text-forest text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                />
                <button
                  type="submit"
                  className="bg-teal hover:bg-teal-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <Link href="/employers" className="text-white/70 hover:text-white transition-colors">
                Browse employers →
              </Link>
              <Link href="/jobs" className="text-white/70 hover:text-white transition-colors">
                View all jobs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured employers */}
      {employers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-forest">
                Featured employers
              </h2>
              <p className="text-gray-600 mt-1">
                Organisations leading the way in First Nations employment
              </p>
            </div>
            <Link
              href="/employers"
              className="text-sm text-teal hover:underline font-medium hidden sm:block"
            >
              View all employers →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employers.map((employer) => (
              <EmployerCard
                key={employer.id}
                name={employer.name}
                slug={employer.slug}
                logo={employer.logo}
                sector={employer.sector}
                headquarters={employer.headquarters}
                shortDescription={employer.shortDescription}
                rapTier={employer.rapTier}
                jobCount={employer._count.jobs}
              />
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/employers" className="text-teal hover:underline font-medium">
              View all employers →
            </Link>
          </div>
        </section>
      )}

      {/* Latest jobs */}
      {jobs.length > 0 && (
        <section className="bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-forest">
                  Latest opportunities
                </h2>
                <p className="text-gray-600 mt-1">
                  Recently posted roles from our employer partners
                </p>
              </div>
              <Link
                href="/jobs"
                className="text-sm text-teal hover:underline font-medium hidden sm:block"
              >
                View all jobs →
              </Link>
            </div>
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  slug={job.slug}
                  location={job.location}
                  workMode={job.workMode}
                  employmentType={job.employmentType}
                  salaryRange={job.salaryRange}
                  identifiedRole={job.identifiedRole}
                  closingDate={job.closingDate}
                  featured={job.featured}
                  employer={job.employer}
                />
              ))}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link href="/jobs" className="text-teal hover:underline font-medium">
                View all jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-forest rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Ready to take the next step?
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Create a free account to save jobs, express interest in roles, and connect
            directly with employers committed to First Nations employment.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-teal hover:bg-teal-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Create an account
            </Link>
            <Link
              href="/employers"
              className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Explore employers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
