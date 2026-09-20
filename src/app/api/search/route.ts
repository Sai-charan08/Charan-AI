import { NextRequest, NextResponse } from 'next/server';
import { getSearchProvider } from '@/lib/search/SearchProviderFactory';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const provider = getSearchProvider();
    const results = await provider.search(query);
    return NextResponse.json({ query, results });
  } catch (err: any) {
    return NextResponse.json({ error: 'Search failed', details: err?.message }, { status: 500 });
  }
}
