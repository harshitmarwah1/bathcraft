"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BathCraftLogoAnimation from "@/components/BathCraftLogoAnimation";
import Button from "@/components/ui/Button";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import Icon from "@/components/ui/Icon";
import { NAV_LINKS } from "@/lib/content";

/**
 * Sticky navbar, 72px. Transparent-bordered over the top of the page; once the
 * user scrolls it picks up a hairline, a soft shadow and a backdrop blur so it
 * separates from the hero photograph underneath.
 */
export default function Navbar() {
  const { user, ready } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // "Get Started" means register when signed out, and "plan a bathroom" once
  // signed in -- the button keeps its label but not its destination.
  const getStartedHref = user ? "/onboarding" : "/signin?mode=signup";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu that stays open behind a resize to desktop would trap focus.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[box-shadow,background-color,backdrop-filter] duration-300",
        scrolled
          ? "bg-white/90 shadow-[0_1px_0_rgb(227_235_242),0_6px_24px_rgb(16_43_78/0.06)] backdrop-blur-md"
          : "bg-white",
      ].join(" ")}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-6 px-5 sm:px-6"
      >
        <Link href="#top" aria-label="BathCraft — home" className="shrink-0">
          <BathCraftLogoAnimation variant="navbar" />
        </Link>

        <ul className="mx-auto hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-[13.5px] font-medium text-body transition-colors hover:text-brand"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-body transition-colors hover:bg-wash hover:text-brand sm:inline-flex"
          >
            <Icon name="search" size={18} />
          </button>

          {/* Hold the slot until the stored profile has been read, so the
              signed-out pair never flashes in front of a signed-in user. */}
          {!ready ? (
            <span className="hidden h-9 w-[168px] sm:block" aria-hidden="true" />
          ) : user ? (
            <UserMenu />
          ) : (
            <>
              <Button href="/signin" variant="outline" size="sm" className="hidden sm:inline-flex">
                Sign in
              </Button>
              <Button
                href={getStartedHref}
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Get Started
              </Button>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-wash lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile navigation. Rendered always so the panel can transition, but
          removed from the tab order and the a11y tree while closed. */}
      <div
        id="mobile-nav"
        inert={!open ? true : undefined}
        className={[
          "overflow-hidden border-t border-hairline bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <ul className="mx-auto max-w-[1280px] px-5 py-4">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="block border-b border-hairline py-3 text-[15px] font-medium text-ink last:border-0"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="flex gap-3 pt-4">
            {user ? (
              <Button href="/bathrooms" variant="primary" size="md" className="flex-1">
                My Bathrooms
              </Button>
            ) : (
              <>
                <Button href="/signin" variant="outline" size="md" className="flex-1">
                  Sign in
                </Button>
                <Button href={getStartedHref} variant="primary" size="md" className="flex-1">
                  Get Started
                </Button>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
