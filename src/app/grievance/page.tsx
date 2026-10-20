import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Mail, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Grievance Redressal & Takedown Protocol | PALATE',
  description: 'Statutory Grievance Redressal Officer under Rule 3(2) IT Rules 2021 and DPDP Act 2023.',
};

export default function GrievancePage() {
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
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#FFEBEB] px-3 py-0.5 text-[10px] font-mono font-black uppercase text-[#D92D20]">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Statutory Compliance (Rule 3(2) IT Rules 2021)</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#121212]">
              Grievance Redressal & Takedown Mechanism
            </h1>
            <p className="text-xs text-[#121212]/60 font-mono">
              Intermediary Guidelines & Digital Media Ethics Code Compliance • Navi Mumbai
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#121212]/80 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide">
                1. Dedicated Grievance Officer
              </h2>
              <p>
                In accordance with the Information Technology Act, 2000 and rules made thereunder, and the Digital Personal Data Protection Act, 2023, the details of the appointed Grievance Officer are published below:
              </p>

              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-4 font-mono text-xs space-y-2 shadow-[2px_2px_0px_#121212]">
                <div className="flex items-center space-x-2 text-sm font-bold text-[#121212]">
                  <Mail className="h-4 w-4 text-[#2748FF]" />
                  <span>Name / Cell: Palate Grievance Redressal Desk</span>
                </div>
                <div><strong>Designation:</strong> Nodal Grievance & Compliance Officer</div>
                <div><strong>Email:</strong> <a href="mailto:grievance@palate.in" className="text-[#2748FF] underline font-bold">grievance@palate.in</a></div>
                <div><strong>Official Address:</strong> Sector 17, Vashi, Navi Mumbai, Maharashtra 400703, India</div>
                <div className="flex items-center space-x-1 text-[#008A52] font-bold pt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Turnaround SLA: Acknowledgement &lt; 24h • Final Resolution &lt; 15 days</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide">
                2. Reporting Procedure for Restaurant Owners & Food Vendors
              </h2>
              <p>
                If you are a restaurant owner, chef, or vendor and believe that a user review, photo, or listing:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Infringes your registered trademark or proprietary copyright.</li>
                <li>Contains unverified defamatory, abusive, or extortionate content.</li>
                <li>Presents factual inaccuracies regarding your dish pricing or establishment name.</li>
              </ul>
              <p>
                Please email <strong>grievance@palate.in</strong> with the subject line <code>"URGENT: Content Grievance Notice - [Establishment Name]"</code> including the battle/check-in URL and supporting verification documents.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide">
                3. Takedown & Intermediary Neutrality
              </h2>
              <p>
                As an intermediary under Section 79 of the IT Act, Palate acts swiftly upon receiving verifiable court orders or government notices by disabling access to unlawful material within <strong>36 hours</strong>, preserving platform neutrality and democratic consumer consensus.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
