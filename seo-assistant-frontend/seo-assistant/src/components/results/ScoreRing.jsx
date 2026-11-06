export default function ScoreRing({ value }) {
  const r = 52, c = 2 * Math.PI * r
  return <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={`SEO Assistant score ${value} out of 100`}>
    <circle cx="66" cy="66" r={r} fill="none" stroke="#eef0f3" strokeWidth="9" />
    <circle cx="66" cy="66" r={r} fill="none" stroke="var(--grn)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 66 66)" />
    <text x="66" y="70" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0f172a">{value}</text>
    <text x="66" y="90" textAnchor="middle" fontSize="12" fill="#64748b">/ 100</text></svg>
}
