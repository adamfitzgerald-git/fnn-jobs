import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/jobs/JobCard";
import { SECTORS, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Job Listings — FNN Employment Hub",
  description: "Browse job opportunities from employers committed to First Nations employment.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    location?: string;
    identified?: string;
    sector?: string;
    type?: string;
  }>;
}) {
  const params = await searchParams;

  const where: any = {
    status: "PUBLISHED",
    OR: [
      { closingDate: null },
      { closingDate: { gte: new Date() } },
    ],
  };

  if (params.q) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { title: { contains: params.q, mode: "insensitive" } },
          { description: { contains: params.q, mode: "insensitive" } },
          { employer: { name: { contains: params.q, mode: "insensitive" } } },
        ],
      },
    ];
  }

  if (params.location) {
    where.location = { contains: params.location, mode: "insensitive" };
  }

  if (params.identified === "true") {
    where.identifiedRole = true;
  }

  if (params.sector) {
    where.employer = { ...where.employer, sector: params.sector };
  }

  if (params.type) {
    where.employmentType = params.type;
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: {
        select: { name: true, slug: true, logo: true, rapTier: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-forest">Job Listings</h1>
        <p className="mt-2 text-gray-600">
          Find opportunities with employers committed to First Nations employment.
        </p>
      </div>

      {/* Search and filters */}
      <form action="/jobs" method="get" className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Search jobs, employers..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
          <button
            type="submit"
            className="bg-teal hover:bg-teal-dark text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            name="location"
            defaultValue={params.location}
            placeholder="Location..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
          <select
            name="sector"
            defaultValue={params.sector || ""}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={params.type || ""}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All types</option>
            {Object.entries(EMPLOYMENT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-forest">
            <input
              type="checkbox"
              name="identified"
              value="true"
              defaultChecked={params.identified === "true"}
              className="rounded border-gray-300 text-teal focus:ring-teal"
            />
            Identified roles only
          </label>
          {(params.q || params.location || params.sector || params.type || params.identified) && (
            <a href="/jobs" className="text-sm text-teal hover:underline self-center">
              Clear filters
            </a>
          )}
        </div>
      </form>

      <p className="text-sm text-gray-500 mb-4">{jobs.length} {jobs.length === 1 ? "role" : "roles"} found</p>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No jobs match your search.</p>
          <a href="/jobs" className="text-teal hover:underline mt-2 inline-block">
            View all listings
          </a>
        </div>
      ) : (
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
              employer={job.employer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
