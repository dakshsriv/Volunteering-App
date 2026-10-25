"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { getAnonymousId } from "@/lib/clientPreferences";

interface ApplyLinkProps {
  opportunityId: number;
  href: string;
  className: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function ApplyLink({
  opportunityId,
  href,
  className,
  children,
  onClick,
}: ApplyLinkProps) {
  function trackApplication(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const anonymousId = getAnonymousId();
    if (!anonymousId) return;

    void fetch("/api/events/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId, anonymousId }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackApplication}
      className={className}
    >
      {children}
    </a>
  );
}