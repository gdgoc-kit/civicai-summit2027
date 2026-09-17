const paths: Record<string, React.ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  program: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </>
  ),
  tracks: (
    <>
      <path d="M5 4v16" />
      <path d="M5 5h11l-2 3 2 3H5" />
    </>
  ),
  venue: (
    <>
      <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  sponsors: (
    <>
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2.2 4.5 5.6 4a4.3 4.3 0 0 1 6.4 2 4.3 4.3 0 0 1 6.4-2c3.4.5 4.8 4 3.1 7.5C19 15.65 12 20 12 20Z" />
    </>
  ),
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.35-1 .7-1 1.7" />
      <path d="M12 17h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20c1.4-3.8 4.6-6 7.5-6s6.1 2.2 7.5 6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H9" />
    </>
  ),
};

export default function NavIcon({
  name,
  className = "h-4 w-4",
}: {
  name: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
