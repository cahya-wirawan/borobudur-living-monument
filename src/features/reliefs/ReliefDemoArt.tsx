/**
 * Original abstract line art (media ids `relief-demo-line-art`, `relief-demo-line-art-02`).
 * DEMO ARTWORK — NOT ORIGINAL RELIEF. It deliberately depicts nothing from the
 * monument: only a frame and neutral shapes that stand in for "a panel".
 */
export function ReliefDemoArt({
  label,
  idPrefix,
  mediaId,
}: {
  label: string;
  idPrefix: string;
  mediaId?: string;
}) {
  const sequence = mediaId === 'relief-demo-line-art-02';
  return (
    <svg
      role="img"
      aria-labelledby={`${idPrefix}-title`}
      viewBox="0 0 320 150"
      className="h-auto w-full"
      fill="none"
      stroke="var(--color-stone)"
      strokeWidth="1.5"
    >
      <title id={`${idPrefix}-title`}>{label}</title>
      <rect x="6" y="6" width="308" height="138" stroke="var(--color-bronze)" />
      <rect x="14" y="14" width="292" height="122" strokeDasharray="3 5" opacity="0.6" />
      {sequence ? (
        <>
          <path d="M111 22v106M209 22v106" />
          <path d="M34 98h58M132 75h58M230 52h58" strokeDasharray="10 6" opacity="0.7" />
          <path d="M46 118h34M144 118h34M242 118h34" />
        </>
      ) : (
        <>
          <circle cx="78" cy="72" r="26" />
          <rect x="134" y="46" width="52" height="52" />
          <path d="M216 98 242 46l26 52z" />
          <path d="M30 118h260" strokeDasharray="10 6" opacity="0.7" />
        </>
      )}
    </svg>
  );
}
