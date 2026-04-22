"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface WikiSidebarLinkProps {
  href: string;
  title: string;
}

export function WikiSidebarLink({ href, title }: WikiSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "font-sans text-sm text-[#6B6560] hover:text-[#0D0F12] transition-colors py-1 block leading-snug",
        isActive && "text-[#0D0F12] font-medium border-l-2 border-[#3ECF8E] pl-2 -ml-2"
      )}
    >
      {title}
    </Link>
  );
}
