import { prisma } from "@/lib/prisma";
import { EmployerCard } from "@/components/employers/EmployerCard";
import { SECTORS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Employer Directory — FNN Employment Hub",
  description: "Browse purpose-driven employers committed to First Nations employment.",
};

export default async function EmployersPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; q?: string }>;
}) {
  const params = await searchParams;
  const where: any = { status: "PUBLISHED" };

  if (params.sector) {
    where.sector = params.sector;
  }
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { shortDescription: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const employers = await prisma.employer.findMany({
    where,
    include: {
      _count: {
        select: {
          jobs: { where: { status: "PUBLISHED", closingDate: { gte: new Date() } } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-forest">
          Employer Directory
        </h1>
        <p className="mt-2 text-gray-600">
          Discover organisations committed to First Nations employment and reconciliation.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <form className="flex-1 flex gap-2" action="/employers" method="get">
          {params.sector && <input type="hidden" name="sector" value={params.sector} />}
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Search employers..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
          <button
            type="submit"
            className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/employers"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              !params.sector
                ? "bg-forest text-white"
                : "bg-white text-forest border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
          </a>
          {SECTORS.map((sector) => (
            <a
              key={sector}
              href={`/employers?sector=${encodeURIComponent(sector)}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                params.sector === sector
                  ? "bg-forest text-white"
                  : "bg-white text-forest border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {sector}
            </a>
          ))}
        </div>
      </div>

      {employers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No employers found.</p>
          {(params.sector || params.q) && (
            <a href="/employers" className="text-teal hover:underline mt-2 inline-block">
              Clear filters
            </a>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}
