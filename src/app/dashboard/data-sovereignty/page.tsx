import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DataSovereigntyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href="/dashboard" className="text-sm text-teal hover:underline">&larr; Back to dashboard</a>
      <h1 className="font-heading text-2xl font-bold text-forest mt-2 mb-4">Your Data</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">&#x1f512;</span>
          <h2 className="font-heading text-xl font-semibold text-forest mb-2">Indigenous Data Sovereignty</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We are developing an Indigenous Data Sovereignty framework in partnership with IBM.
            You will be notified when this is live.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Your data is stored securely and is never shared without your explicit consent.
          </p>
          <span className="inline-block mt-4 px-3 py-1 bg-amber/10 text-amber rounded-full text-sm font-medium">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
