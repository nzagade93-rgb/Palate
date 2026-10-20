import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | PALATE',
  description: 'Cancellation, Refund, and Digital Service Fulfillment Policy for Palate.',
};

export default function RefundPage() {
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
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Gateway & Merchant Compliance</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#121212]">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xs text-[#121212]/60 font-mono">
              Applies to Restaurant Partner Campaigns, Boosts & Digital Services • Effective: January 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#121212]/80 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-[#A16207]" />
                <span>1. Nature of Services (Digital Fulfillment)</span>
              </h2>
              <p>
                Palate provides digital marketing, community engagement, and algorithmic discovery tools to restaurants and food vendors across Navi Mumbai.
              </p>
              <div className="p-3 rounded-xl border border-[#121212]/20 bg-[#F6EFE2] text-xs space-y-1">
                <strong>📦 Digital Delivery Statement:</strong> All services offered on Palate are intangible digital software services. No physical products or tangible goods are shipped or delivered. Service activation occurs electronically upon order confirmation.
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#2748FF]" />
                <span>2. Campaign Cancellation Rules</span>
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pre-Activation Cancellation (Eligible for 100% Refund):</strong> If a partner restaurant purchases a featured campaign or banner slot but requests cancellation at least <strong>48 hours before</strong> the campaign's scheduled live broadcast date, a full refund (minus payment processing fees) will be granted.
                </li>
                <li>
                  <strong>Active / Ongoing Campaigns (Non-Refundable):</strong> Once a featured campaign, tasting trial, or sponsored banner has gone live on the platform or voting has commenced, fees become non-refundable as server resources, impressions, and digital reach have already been committed.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#008A52]" />
                <span>3. Refund Processing Timelines</span>
              </h2>
              <p>
                Approved refunds are processed in compliance with Reserve Bank of India (RBI) payment settlement guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refunds are automatically routed to the original payment instrument (UPI ID, Credit/Debit Card, or Netbanking account).</li>
                <li>Standard bank settlement turnaround is <strong>5 to 7 business days</strong> depending on your issuing bank.</li>
                <li>An automated electronic credit note with transaction reference number will be emailed to you upon issuance.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t-2 border-[#121212]/10 pt-4">
              <h2 className="text-base font-black text-[#121212] uppercase tracking-wide flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-[#D92D20]" />
                <span>4. Billing Inquiries & Support</span>
              </h2>
              <p className="text-xs">
                To request a cancellation, verify a refund status, or obtain a GST tax invoice copy, please reach out with your Order ID:
              </p>
              <div className="p-3.5 rounded-xl border-2 border-[#121212] bg-[#F6EFE2] font-mono text-xs space-y-1">
                <div><strong>Billing Desk:</strong> billing@palate.in / accounts@palate.in</div>
                <div><strong>Support Hours:</strong> Monday – Friday, 10:00 AM – 6:00 PM IST</div>
                <div><strong>Location:</strong> Navi Mumbai, Maharashtra, India</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
