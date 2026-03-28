export function GroVerifiedSection({ groVerified }: { groVerified: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="font-heading text-lg font-semibold text-forest mb-3">
        GRO Verified by 15 Times Better
      </h2>
      {groVerified ? (
        <div className="flex items-center gap-3 p-3 bg-teal/10 rounded-lg">
          <span className="text-2xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-teal">GRO Assessment Verified</p>
            <p className="text-xs text-gray-600">This employer has completed a formal GRO Assessment with 15 Times Better.</p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            This employer has not yet completed a GRO Assessment.
          </p>
          <a
            href="https://15timesbetter.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal hover:underline mt-2 inline-block"
          >
            Learn more about verification with 15 Times Better ↗
          </a>
        </div>
      )}
    </div>
  );
}
