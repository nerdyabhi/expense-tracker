import { NextResponse } from 'next/server';
import { transactions } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  
  let responseData = [...transactions];

  if (limit) {
    responseData = responseData.slice(0, parseInt(limit, 10));
  }

  return NextResponse.json({ transactions: responseData });
}
