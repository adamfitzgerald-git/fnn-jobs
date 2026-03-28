import { prisma } from "@/lib/prisma";

export async function SalaryBenchmarkWidget({ sector }: { sector?: string }) {
  const where = sector ? { sector } : {};
  const benchmarks = await prisma.salaryBenchmark.findMany({
    where,
    orderBy: [{ sector: "asc" }, { location: "asc" }],
    take: 10,
  });

  if (benchmarks.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="font-heading text-lg font-semibold text-forest mb-1">Salary Guide</h2>
      <p className="text-xs text-gray-500 mb-4">Median salary ranges by sector and location</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-2 font-medium">Sector</th>
              <th className="pb-2 font-medium">Location</th>
              <th className="pb-2 font-medium text-right">Range</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b) => (
              <tr key={b.id} className="border-b border-gray-50">
                <td className="py-2 text-forest">{b.sector}</td>
                <td className="py-2 text-gray-600">{b.location}</td>
                <td className="py-2 text-right text-gray-700">
                  ${(b.medianMin / 1000).toFixed(0)}k&ndash;${(b.medianMax / 1000).toFixed(0)}k
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Source: ABS / SEEK salary data. Updated quarterly.</p>
    </div>
  );
}
