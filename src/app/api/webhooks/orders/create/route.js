import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { appendOrder } from '../../../../../lib/storage';

function verifyShopifyHmac(rawBody, hmacHeader, secret) {
	if (!hmacHeader || !secret) return false;
	const digest = crypto
		.createHmac('sha256', secret)
		.update(rawBody, 'utf8')
		.digest('base64');
	return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
}

export async function POST(request) {
	const shopifyHmac = request.headers.get('x-shopify-hmac-sha256');
	const rawBody = await request.text();

	const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
	const isValid = verifyShopifyHmac(rawBody, shopifyHmac, secret);
	if (!isValid) {
		return new NextResponse('Invalid HMAC', { status: 401 });
	}

	try {
		const payload = JSON.parse(rawBody);
		appendOrder(payload);
		return NextResponse.json({ ok: true });
	} catch (err) {
		return new NextResponse('Bad Request', { status: 400 });
	}
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

