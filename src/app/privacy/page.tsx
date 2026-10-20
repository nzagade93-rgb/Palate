import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | PALATE Navi Mumbai',
  description: 'Digital Personal Data Protection (DPDP) Act 2023 compliant Privacy Policy for Palate.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE2] text-[#121212] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-black uppercase text-[#121212] bg-[#FFFFFF] border-2 border-[#121212] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Palate</span>
        </Link>

        <div className="rounded-2xl border-[2.5px] border-[#121212] bg-[#FFFFFF] p-6 sm:p-10 shadow-[6px_6px_0px_#121212] space-y-6">
          <div className="border-b-2 border-[#121212]/15 pb-4 space-y-1">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#E3F9ED] px-3 py-0.5 text-[10px] font-mono font-black uppercase text-[#008A52]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#121212]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#121212]/60 font-mono">
              Last Updated: January 2026 • Effective Date: January 1, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#121212]/80 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <Lock className="h-4 w-4 text-[#A16207]" />
                <span>1. Commitment to Data Protection</span>
              </h2>
              <p>
                Palate Technologies ("Palate", "we", "our", or "us") is dedicated to safeguarding your privacy in compliance with India’s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
              </p>
              <p>
                This Privacy Policy explains how we collect, store, process, and protect your digital information when you use the Palate web application, participate in food battles, and upload dining check-ins across Navi Mumbai.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <Database className="h-4 w-4 text-[#2748FF]" />
                <span>2. Information We Collect</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Anonymous Device Fingerprint:</strong> A non-reversible cryptographic hash generated from your browser user-agent and screen attributes. We use this strictly to prevent duplicate ballot stuffing in food battles without harvesting personal identity.
                </li>
                <li>
                  <strong>User Account Credentials (Optional):</strong> If you choose to log in via Supabase Auth, we store your email address and optional display name for syncing your Food Passport across devices.
                </li>
                <li>
                  <strong>User-Submitted Dining Receipts:</strong> When you upload a bill receipt for verified diner verification, the photo is compressed locally and stored in encrypted cloud object storage solely for badge attribution. <em>You are strongly advised to conceal credit card digits and phone numbers prior to upload.</em>
                </li>
                <li>
                  <strong>Anonymous Usage Telemetry:</strong> Aggregated battle view counts, vote distributions, and node filter selections to improve culinary discovery.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <Eye className="h-4 w-4 text-[#FF5C9A]" />
                <span>3. How We Use Your Data</span>
              </h2>
              <p>We use the collected information exclusively to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Authenticate 1-person-1-vote integrity in local culinary showdowns.</li>
                <li>Issue verified food stamps, foodie gems, and leaderboards.</li>
                <li>Prevent Sybil attacks, fraudulent votes, and malicious denial of service.</li>
                <li>Fulfill statutory reporting obligations under Indian law.</li>
              </ul>
              <p className="font-bold text-[#121212]">
                We NEVER sell, rent, or trade your personal data or uploaded receipts to third-party advertising brokers or data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-[#008A52]" />
                <span>4. Your Rights Under DPDP Act 2023</span>
              </h2>
              <p>As a Data Principal, you are entitled to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Right to Access:</strong> Request a summary of personal data processed by Palate.</li>
                <li><strong>Right to Correction & Erasure:</strong> Request the deletion of your account, uploaded receipts, and check-in history.</li>
                <li><strong>Right of Grievance Redressal:</strong> Direct complaints to our appointed Grievance Officer.</li>
                <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your rights in the event of incapacity.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t-2 border-[#121212]/10 pt-4">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide">
                5. Grievance Officer Contact
              </h2>
              <p className="text-xs">
                In compliance with Section 5 of the DPDP Act and Rule 3(2) of the Information Technology Rules, 2021:
              </p>
              <div className="p-3.5 rounded-xl border-2 border-[#121212] bg-[#F6EFE2] font-mono text-xs space-y-1">
                <div><strong>Designation:</strong> Grievance Redressal Officer</div>
                <div><strong>Email:</strong> grievance@palate.in / legal@palate.in</div>
                <div><strong>Turnaround Time:</strong> Acknowledged within 24 hours; resolved within 15 days.</div>
                <div><strong>Jurisdiction:</strong> Navi Mumbai, Maharashtra, India</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
