import { PledgeStatusBadge } from "@/components/ui/PledgeStatusBadge";
import { formatDate } from "@/lib/utils";

type Pledge = {
  id: string;
  text: string;
  dueDate: Date | string;
  status: string;
};

export function PledgeList({ pledges }: { pledges: Pledge[] }) {
  if (pledges.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="font-heading text-xl font-semibold text-forest mb-4">
        Commitment Pledges
      </h2>
      <div className="space-y-4">
        {pledges.map((pledge) => {
          const borderClass =
            pledge.status === "ACHIEVED"
              ? "border-green-200 bg-green-50/50"
              : pledge.status === "OVERDUE"
              ? "border-red-200 bg-red-50/30"
              : "border-teal/30";

          return (
            <div
              key={pledge.id}
              className={`p-4 rounded-lg border ${borderClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-forest text-sm">{pledge.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {formatDate(pledge.dueDate)}
                  </p>
                </div>
                <PledgeStatusBadge status={pledge.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
