import { NextResponse } from 'next/server';
import { getBudgets } from '@/app/actions';

export async function GET() {
  try {
    const budgets = await getBudgets();
    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Budgets API error:', error);
    return NextResponse.json({ budgets: [] }, { status: 500 });
  }
}
