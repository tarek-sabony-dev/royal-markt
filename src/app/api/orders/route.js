import { NextResponse } from 'next/server';
import { readAllOrders } from '../../../lib/storage';

export async function GET() {
	const orders = readAllOrders();
	return NextResponse.json({ orders });
}

export const dynamic = 'force-dynamic';

