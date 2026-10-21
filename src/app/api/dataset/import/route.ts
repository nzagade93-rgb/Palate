import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INITIAL_RESTAURANTS } from '@/lib/mockData';

// ==============================================================================
// PALATE: Dataset Ingestion Endpoint
// Ingests scraped Navi Mumbai businesses from pipeline.py / businesses_input.csv
// Columns: Venue Name, Category, Rating, Address, Website, Google Maps URL, Public Business Phone, City
// ==============================================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    totalPreloaded: INITIAL_RESTAURANTS.length,
    supportedNodes: [
      'Vashi',
      'Nerul',
      'Belapur',
      'Kharghar',
      'Seawoods',
      'Sanpada',
      'Airoli',
      'Kopar Khairane',
      'Ghansoli',
      'Kamothe',
      'Panvel',
    ],
    message: 'Post CSV or JSON to this endpoint to import Navi Mumbai restaurants.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let venues: any[] = [];

    if (contentType.includes('application/json')) {
      const body = await req.json();
      venues = Array.isArray(body) ? body : body.restaurants || [body];
    } else {
      // Parse CSV Text
      const text = await req.text();
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length > 1) {
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"/, '').replace(/"$/, ''));
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((c) => c.trim().replace(/^"/, '').replace(/"$/, ''));
          const item: Record<string, string> = {};
          headers.forEach((h, idx) => {
            item[h] = row[idx] || '';
          });
          venues.push(item);
        }
      }
    }

    if (venues.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No venue records found to import' },
        { status: 400 }
      );
    }

    // Process & Standardize Venues
    const processed = venues.map((v, index) => {
      const name = v['Venue Name'] || v.name || 'Unnamed Venue';
      const address = v['Address'] || v.address || '';
      
      // Auto-detect node from address or venue name
      let detectedNode = 'Vashi';
      const nodes = [
        'Vashi',
        'Nerul',
        'Belapur',
        'Kharghar',
        'Seawoods',
        'Sanpada',
        'Airoli',
        'Kopar Khairane',
        'Ghansoli',
        'Kamothe',
        'Panvel',
      ];
      for (const n of nodes) {
        if (address.toLowerCase().includes(n.toLowerCase()) || name.toLowerCase().includes(n.toLowerCase())) {
          detectedNode = n;
          break;
        }
      }

      return {
        id: `imported-${Date.now()}-${index}`,
        name,
        category: v['Category'] || v.category || 'Restaurant',
        rating: parseFloat(v['Rating'] || v.rating || '4.2'),
        address,
        node: detectedNode,
        googleMapsUrl: v['Google Maps URL'] || v.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + detectedNode)}`,
        phone: v['Public Business Phone'] || v.phone || '',
        importedAt: new Date().toISOString(),
      };
    });

    // If Supabase is connected, attempt table insertion
    if (supabase) {
      try {
        await supabase.from('restaurants').upsert(processed, { onConflict: 'name' });
      } catch (dbErr) {
        console.warn('Database upsert notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: processed.length,
      sample: processed.slice(0, 3),
      message: `Successfully processed ${processed.length} Navi Mumbai venues into Palate engine.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Import failed' },
      { status: 500 }
    );
  }
}
