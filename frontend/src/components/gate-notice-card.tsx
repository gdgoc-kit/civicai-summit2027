import Link from "next/link";

export default function GateNoticeCard({
  message,
  ctaHref,
  ctaLabel,
}: {
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-rule bg-card p-8 text-center">
      <p className="text-sm text-foreground-soft">{message}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-4 inline-block rounded-full bg-g-blue px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
