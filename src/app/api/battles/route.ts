// ==============================================================================
// PALATE API: /api/battles (GET, POST)
// Retrieve and create food battles
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getBattles, getBattleBySlug, createBattle } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fingerprint = searchParams.get('fingerprint') || undefined;
    const slug = searchParams.get('slug');

    if (slug) {
      const battle = await getBattleBySlug(slug, fingerprint);
      if (!battle) {
        return NextResponse.json({ success: false, error: 'Battle not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, battle });
    }

    const battles = await getBattles(fingerprint);
    return NextResponse.json({ success: true, battles });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch battles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      battle_type,
      dish_name,
      category,
      city,
      neighborhood,
      contestant_a_name,
      contestant_a_restaurant,
      contestant_a_image,
      contestant_b_name,
      contestant_b_restaurant,
      contestant_b_image,
      description,
      submitter_fingerprint
    } = body;

    if (!title || !contestant_a_name || !contestant_b_name || !submitter_fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Title, Contestant A, Contestant B and device fingerprint are required' },
        { status: 400 }
      );
    }

    const newBattle = await createBattle({
      title,
      battleType: battle_type || 'dish',
      dishName: dish_name || title,
      category: category || 'Street Food',
      city: city || 'Navi Mumbai',
      neighborhood: neighborhood || 'Vashi',
      contestantAName: contestant_a_name,
      contestantARestaurant: contestant_a_restaurant,
      contestantAImage: contestant_a_image,
      contestantBName: contestant_b_name,
      contestantBRestaurant: contestant_b_restaurant,
      contestantBImage: contestant_b_image,
      description,
      submitterFingerprint: submitter_fingerprint
    });

    return NextResponse.json({
      success: true,
      message: 'Battle created! Enter the arena and rally your community to vote.',
      battle: newBattle
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create battle' },
      { status: 500 }
    );
  }
}
