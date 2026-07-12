import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { terrainProducts } from '@/lib/terrain-catalog'

type CheckoutLine = { name: string; quantity: number }

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })

  const body = await request.json().catch(() => null) as { items?: CheckoutLine[] } | null
  if (!body?.items?.length) return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 })

  const lines = body.items.flatMap((line) => {
    const productName = line.name.split(' / ')[0]
    const product = terrainProducts.find((item) => item.name === productName)
    if (!product || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10) return []
    const amount = Number(product.price.replace(/[^\d]/g, '')) * 100
    return [{ price_data: { currency: 'aed', product_data: { name: product.name, description: product.world, images: [`${request.nextUrl.origin}${product.image}`] }, unit_amount: amount }, quantity: line.quantity }]
  })

  if (!lines.length) return NextResponse.json({ error: 'Some items in your bag are no longer available.' }, { status: 400 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lines,
    allow_promotion_codes: true,
    shipping_address_collection: { allowed_countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'GB', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'] },
    success_url: `${request.nextUrl.origin}/?checkout=success`,
    cancel_url: `${request.nextUrl.origin}/?checkout=cancelled`,
  })
  return NextResponse.json({ url: session.url })
}
