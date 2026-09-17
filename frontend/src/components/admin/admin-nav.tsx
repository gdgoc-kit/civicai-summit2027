import Link from "next/link";

const adminNavLinks = [
  { href: "/admin", label: "概要" },
  { href: "/admin/settings", label: "設定" },
  { href: "/admin/status", label: "申込み状況確認" },
  { href: "/admin/list", label: "一覧" },
];

export default function AdminNav({ current }: { current: string }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {adminNavLinks.map((link) => {
        const isCurrent = link.href === current;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              isCurrent
                ? "bg-g-blue text-white"
                : "border border-rule text-foreground-soft hover:border-g-blue hover:text-g-blue"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
