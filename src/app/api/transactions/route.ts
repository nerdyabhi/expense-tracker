import { NextResponse } from 'next/server';
import { getTransactions } from '@/app/actions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    const transactions = await getTransactions();
    let responseData = transactions;

    if (limit) {
      responseData = responseData.slice(0, parseInt(limit, 10));
    }

    return NextResponse.json({ transactions: responseData });
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({ transactions: [] }, { status: 500 });
  }
}
