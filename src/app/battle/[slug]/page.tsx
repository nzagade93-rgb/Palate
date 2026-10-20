import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEED_BATTLES, getBattleBySlug } from '@/lib/store';
import BattleDetailClient from './BattleDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_BATTLES.map((battle) => ({
    slug: battle.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const battle = await getBattleBySlug(slug);

  if (!battle) {
    return {
      title: 'Battle Not Found — PALATE',
      description: 'The requested food fight does not exist or has been archived.',
    };
  }

  const title = `${battle.title} — PALATE Food Fight`;
  const description = `${battle.contestantA.name} (${battle.percentA}%) vs ${battle.contestantB.name} (${battle.percentB}%) in ${battle.neighborhood}, Navi Mumbai. Vote, defend your taste, and settle the score!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://palate.app/battle/${battle.slug}`,
      images: [
        {
          url: battle.contestantA.imageUrl,
          width: 800,
          height: 600,
          alt: battle.title,
        },
      ],
      siteName: 'PALATE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [battle.contestantA.imageUrl],
    },
  };
}

export default async function BattlePage({ params }: Props) {
  const { slug } = await params;
  const battle = await getBattleBySlug(slug);

  if (!battle) {
    notFound();
  }

  return <BattleDetailClient initialBattle={battle} />;
}
