import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, ShieldAlert, FileText, CheckSquare, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Use & Intermediary Safe Harbor | PALATE',
  description: 'Terms of Service, User Agreement, and Section 79 IT Act Intermediary terms for Palate.',
};

export default function TermsPage() {
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
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#FFD11A] px-3 py-0.5 text-[10px] font-mono font-black uppercase text-[#121212]">
              <Scale className="h-3.5 w-3.5" />
              <span>Section 79 IT Act 2000 Intermediary</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#121212]">
              Terms of Use & Safe Harbor
            </h1>
            <p className="text-xs text-[#121212]/60 font-mono">
              Last Updated: January 2026 • Governing Law: Republic of India
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#121212]/80 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <FileText className="h-4 w-4 text-[#A16207]" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p>
                By accessing, browsing, voting, or uploading content to Palate ("Platform"), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Use and our Privacy Policy. If you do not agree, you must immediately cease accessing the Platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-[#2748FF]" />
                <span>2. Intermediary Status (Section 79, IT Act 2000)</span>
              </h2>
              <p>
                Palate operates strictly as an <strong>online intermediary</strong> as defined under Section 2(1)(w) of the Information Technology Act, 2000.
              </p>
              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-4 text-xs space-y-2">
                <p>
                  <strong>No Editorial Endorsement:</strong> Food battle rankings, community votes, check-ins, and commentary are user-generated crowdsourced opinions. Palate does not initiate, curate, or alter user votes.
                </p>
                <p>
                  <strong>Not a Health or Commercial Certification:</strong> Rankings do not constitute medical, nutritional, hygienic, or official certification of food safety standards (such as FSSAI compliance). Diners consume food at their own discretion and risk.
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <CheckSquare className="h-4 w-4 text-[#008A52]" />
                <span>3. Code of Conduct & Anti-Rigging Rules</span>
              </h2>
              <p>When participating in Palate, users agree strictly NOT to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deploy bots, automated scripts, VPN proxies, or emulator farms to manipulate battle percentages.</li>
                <li>Post defamatory, obscene, religiously offensive, extortionate, or fraudulent reviews targeting local food stalls or restaurants.</li>
                <li>Upload forged, fraudulent, or altered dining receipts.</li>
                <li>Sell, broker, or trade voting accounts or community badges.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-[#D92D20]" />
                <span>4. Limitation of Liability & Restaurant Indemnity</span>
              </h2>
              <p>
                To the fullest extent permitted by law, Palate and its founders shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dining experiences, allergic reactions, food-borne illnesses, or quality discrepancies at listed restaurants.</li>
                <li>Commercial loss or business reputation effects claimed by dining establishments arising from voluntary consumer polling.</li>
                <li>Temporary platform downtime, cloud maintenance, or network errors.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t-2 border-[#121212]/10 pt-4">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide">
                5. Takedown Notices & Dispute Jurisdiction
              </h2>
              <p className="text-xs">
                In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, legitimate copyright or defamatory content grievances must be directed to:
              </p>
              <div className="p-3.5 rounded-xl border-2 border-[#121212] bg-[#F6EFE2] font-mono text-xs space-y-1">
                <div><strong>Grievance Officer:</strong> Palate Intermediary Redressal Cell</div>
                <div><strong>Email:</strong> grievance@palate.in</div>
                <div><strong>Jurisdiction:</strong> Exclusive jurisdiction of courts in Navi Mumbai / Thane, Maharashtra.</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
