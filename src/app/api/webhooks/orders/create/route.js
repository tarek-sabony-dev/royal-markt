import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addOrder } from '@/lib/storage';

export async function POST(req) {
  try {
    // Verify webhook origin (optional but recommended)
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const body = await req.text();
    
    // Log the raw body for debugging
    console.log('Webhook received:', body.substring(0, 200) + '...');
    
    if (process.env.SHOPIFY_API_SECRET && hmac) {
      const generatedHash = crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(body)
        .digest('base64');
      
      if (hmac !== generatedHash) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let order;
    try {
      order = JSON.parse(body);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Validate required fields
    if (!order.id || !order.email) {
      console.error('Missing required fields in order data');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Format order data for storage
    const orderData = {
      id: order.id,
      order_id: order.id,
      customer_email: order.email,
      total_price: order.total_price || '0.00',
      currency: order.currency || 'USD',
      financial_status: order.financial_status || '',
      fulfillment_status: order.fulfillment_status || '',
      line_items: order.line_items ? order.line_items.map(item => ({
        product_id: item.product_id || 0,
        variant_id: item.variant_id || 0,
        title: item.title || '',
        quantity: item.quantity || 0,
        price: item.price || '0.00',
        sku: item.sku || ''
      })) : []
    };
    
    // Save order to JSON file
    const success = addOrder(orderData);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    console.log('Order saved successfully:', order.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}