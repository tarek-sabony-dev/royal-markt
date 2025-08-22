import { NextResponse } from 'next/server';
import { readOrders, getStats } from '@/lib/storage';

export async function GET() {
  try {
    const orders = readOrders();
    const stats = getStats();
    
    return NextResponse.json({
      orders,
      stats
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 