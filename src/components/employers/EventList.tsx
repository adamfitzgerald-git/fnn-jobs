import { formatDate } from "@/lib/utils";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  registrationUrl: string | null;
};

export function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="font-heading text-xl font-semibold text-forest mb-4">
        Upcoming Events
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg border border-gray-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-forest font-medium text-sm">{event.title}</h3>
                {event.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-teal hover:underline mt-2 font-medium"
                  >
                    Register &rarr;
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(event.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
