import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-forest text-white/70 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-lg text-white mb-3">
              FNN Employment Hub
            </h3>
            <p className="text-sm leading-relaxed">
              Connecting First Nations jobseekers with purpose-driven employers.
              A First Nations News initiative.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/employers" className="hover:text-white transition-colors">
                  Employer Directory
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Job Listings
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register as Jobseeker
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://firstnationsnews.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  First Nations News
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
          {process.env.NEXT_PUBLIC_IBM_PARTNER_ENABLED === "true" && (
            <p className="text-white/50 mb-2">
              Founding Technology Partner: <span className="font-semibold text-white/70">IBM</span>
            </p>
          )}
          <p>© {new Date().getFullYear()} First Nations News. All rights reserved.</p>
          <p className="mt-1 text-white/40">
            We acknowledge Aboriginal and Torres Strait Islander peoples as the
            Traditional Custodians of this land.
          </p>
        </div>
      </div>
    </footer>
  );
}
