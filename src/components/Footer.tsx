'use client';

import React from 'react';
import Link from 'next/link';
import PalateLogo from '@/components/PalateLogo';

export const Footer: React.FC = () => {
  return (
    <footer
      className="palate-footer mt-16 pt-10 pb-16 border-t border-[var(--footer-border)] bg-[var(--footer-bg)] text-[var(--footer-ink)]"
      style={
        {
          '--footer-bg': '#FFFFFF',
          '--footer-ink': '#02060C',
          '--footer-muted': '#686B78',
          '--footer-border': 'rgba(2, 6, 12, 0.08)',
          '--footer-border-bold': 'rgba(2, 6, 12, 0.16)',
          '--footer-yellow': '#F6B21A',
          '--footer-card-bg': '#F8F9FA',
          '--footer-line-height-body': '1.6',
        } as React.CSSProperties
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr_1fr] gap-6 lg:gap-8 items-start">
          {/* ============================================================
              MODULE 1: BRAND IDENTITY & TRUST STATEMENT
              ============================================================ */}
          <div className="order-1 md:col-start-1 md:row-start-1 space-y-3.5">
            <div className="flex items-center gap-2">
              <PalateLogo size="md" showTagline={true} />
            </div>

            <p className="text-xs text-[var(--footer-muted)] leading-[1.6]">
              Hyper-local, dish-first food battles and community consensus platform covering Vashi, Nerul, Belapur, Kharghar, Seawoods, and Sanpada.
            </p>

            {/* Dominant Key Trust Guarantee */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--footer-yellow)]/20 border border-[var(--footer-border-bold)]/20 text-xs font-bold text-[var(--footer-ink)] shadow-xs">
              <svg
                className="w-4 h-4 text-[#A16207] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>100% community-voted. Never paid rankings.</span>
            </div>
          </div>

          {/* ============================================================
              MODULE 2: GRIEVANCE OFFICER & TAKEDOWNS CARD
              Desktop: Col 3, Row 1-2 | Tablet: Col 1-2 (full width), Row 3 | Mobile: Order 2
              ============================================================ */}
          <div className="order-2 md:col-span-2 md:col-start-1 md:row-start-3 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 space-y-2">
            <div className="h-7 flex items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--footer-ink)]">
                Grievance Officer &amp; Takedowns
              </h3>
            </div>

            {/* TODO: Have a qualified legal counsel verify statutory compliance wording and intermediary notices */}
            <div className="rounded-xl border-2 border-[var(--footer-border-bold)] bg-[var(--footer-card-bg)] p-4 text-xs space-y-3.5 shadow-[3px_3px_0px_#1C1917]">
              <div className="space-y-2">
                {/* Heading kept exactly as specified */}
                <h4 className="font-bold text-[var(--footer-ink)] text-xs leading-snug">
                  Rule 3(2) IT (Intermediary Guidelines) Rules, 2021
                </h4>

                {/* 3 Actionable Chips replacing the long question */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FAF8F5] text-[var(--footer-ink)] border border-[var(--footer-border-bold)]/25">
                    Copyright
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FAF8F5] text-[var(--footer-ink)] border border-[var(--footer-border-bold)]/25">
                    Defamation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FAF8F5] text-[var(--footer-ink)] border border-[var(--footer-border-bold)]/25">
                    Listing correction
                  </span>
                </div>
              </div>

              {/* Data fields: ONLY section utilizing Monospace accent typography */}
              <div className="font-mono text-[11px] space-y-2 pt-2.5 border-t border-[var(--footer-border)] text-[var(--footer-ink)]">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="font-bold text-[var(--footer-ink)]">Officer:</span>
                  <span className="text-[var(--footer-ink)] font-semibold tracking-wide">
                    &#123;OFFICER_NAME&#125;
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="font-bold text-[var(--footer-ink)]">Email:</span>
                  <a
                    href="mailto:grievance@palate.in?subject=Takedown%20Request%20-%20%5BRestaurant%20Name%5D"
                    className="text-[var(--footer-ink)] underline font-bold hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded transition-opacity"
                  >
                    grievance@palate.in
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-[var(--footer-ink)]">Turnaround:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-[var(--footer-yellow)] text-[var(--footer-ink)] border border-[var(--footer-border-bold)]">
                    Response within 36 hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              MODULE 3: STATUTORY COMPLIANCE & ETHICS
              Desktop: Col 2, Row 1-2 | Tablet: Col 2, Row 1-2 | Mobile: Order 3
              ============================================================ */}
          <div className="order-3 md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 space-y-2">
            <div className="h-7 flex items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--footer-ink)]">
                Statutory Compliance &amp; Ethics
              </h3>
            </div>

            <ul className="space-y-3.5 pt-0.5">
              <li className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--footer-ink)] bg-[#1C1917]/8 px-2 py-0.5 rounded border border-[#1C1917]/15">
                    Independent &amp; Non-Sponsored
                  </span>
                </div>
                <p className="text-xs text-[var(--footer-muted)] leading-[1.6]">
                  Rankings are decided by community votes. Restaurants can&apos;t pay to rank higher or suppress badges.
                </p>
              </li>

              <li className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--footer-ink)] bg-[#1C1917]/8 px-2 py-0.5 rounded border border-[#1C1917]/15">
                    ASCI 2023
                  </span>
                </div>
                <p className="text-xs text-[var(--footer-muted)] leading-[1.6]">
                  Any future sponsored campaign will be clearly marked #Ad or #Sponsored.
                </p>
              </li>

              <li className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--footer-ink)] bg-[#1C1917]/8 px-2 py-0.5 rounded border border-[#1C1917]/15">
                    DPDP Act 2023
                  </span>
                </div>
                <p className="text-xs text-[var(--footer-muted)] leading-[1.6]">
                  Receipts are used only for verification badges. Payment details are masked.
                </p>
              </li>
            </ul>
          </div>

          {/* ============================================================
              MODULE 4: SAFE HARBOR DECLARATION BOX
              Desktop: Col 1, Row 2 | Tablet: Col 1, Row 2 | Mobile: Order 4
              ============================================================ */}
          <div className="order-4 md:col-start-1 md:row-start-2 lg:col-start-1 lg:row-start-2">
            <div className="rounded-xl bg-[var(--footer-card-bg)] border border-[var(--footer-border)] p-3 text-xs leading-[1.6] space-y-1.5 shadow-xs">
              <div className="flex items-start gap-2">
                <svg
                  className="w-3.5 h-3.5 text-[var(--footer-ink)] shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <span className="font-bold text-[var(--footer-ink)]">
                    Section 79 IT Act 2000 Safe Harbor:
                  </span>{' '}
                  <span className="text-[var(--footer-muted)]">
                    Palate operates strictly as an intermediary hosting crowdsourced sentiment, poll votes, and unverified dining reviews. We do not endorse, verify, or vouch for food safety, hygiene, licensing, or commercial standards of listed establishments.
                  </span>
                </div>
              </div>
              <div className="pl-5.5 pt-0.5">
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--footer-ink)] underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded transition-opacity"
                >
                  Read full Safe Harbor terms <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTTOM BAR: COPYRIGHT & LEGAL NAVIGATION
            - Matching border weight and color with top divider
            - Single flex row on desktop (no dangling bullet separators)
            - 2x2 grid on mobile with comfortable min 44px tap targets
            ============================================================ */}
        <div className="pt-6 border-t border-[var(--footer-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-[var(--footer-muted)]">
          <div className="order-2 md:order-1 text-center md:text-left text-[12px] sm:text-[13px] font-sans">
            &copy; 2026 Palate Technologies. Built with pride for Navi Mumbai foodies.
          </div>

          <nav
            aria-label="Legal"
            className="order-1 md:order-2 w-full md:w-auto"
          >
            {/* Desktop / Tablet: Flex row using CSS pseudo-dividers */}
            <div className="hidden sm:flex flex-wrap items-center justify-center md:justify-end text-[14px] font-medium text-[var(--footer-ink)] palate-footer-legal-links">
              <Link
                href="/terms"
                className="hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded px-0.5 py-1 transition-opacity"
              >
                Terms &amp; Safe Harbor
              </Link>
              <Link
                href="/privacy"
                className="hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded px-0.5 py-1 transition-opacity"
              >
                Privacy (DPDP)
              </Link>
              <Link
                href="/refund"
                className="hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded px-0.5 py-1 transition-opacity"
              >
                Refund Policy
              </Link>
              <Link
                href="/grievance"
                className="hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none rounded px-0.5 py-1 transition-opacity"
              >
                Grievance Desk
              </Link>
            </div>

            {/* Mobile (< 640px): Tidy 2x2 grid with >=44px touch targets */}
            <div className="grid sm:hidden grid-cols-2 gap-2 text-[14px] font-medium text-[var(--footer-ink)]">
              <Link
                href="/terms"
                className="min-h-[44px] flex items-center justify-center text-center px-3 py-2 rounded-lg bg-[var(--footer-card-bg)] border border-[var(--footer-border)] hover:bg-[#FAF8F5] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none"
              >
                Terms &amp; Safe Harbor
              </Link>
              <Link
                href="/privacy"
                className="min-h-[44px] flex items-center justify-center text-center px-3 py-2 rounded-lg bg-[var(--footer-card-bg)] border border-[var(--footer-border)] hover:bg-[#FAF8F5] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none"
              >
                Privacy (DPDP)
              </Link>
              <Link
                href="/refund"
                className="min-h-[44px] flex items-center justify-center text-center px-3 py-2 rounded-lg bg-[var(--footer-card-bg)] border border-[var(--footer-border)] hover:bg-[#FAF8F5] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none"
              >
                Refund Policy
              </Link>
              <Link
                href="/grievance"
                className="min-h-[44px] flex items-center justify-center text-center px-3 py-2 rounded-lg bg-[var(--footer-card-bg)] border border-[var(--footer-border)] hover:bg-[#FAF8F5] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-[var(--footer-ink)] focus-visible:outline-none"
              >
                Grievance Desk
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
