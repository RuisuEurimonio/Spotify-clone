import Stripe from "stripe";
import {headers} from "next/headers";

import { stripe } from "@/libs/stripe"
import{
    upsertProductRecord,
    upsertPriceRecorc,
    manageSuscriptionStatusChange
} from "@/libs/supabaseAdmin"
import { NextResponse } from "next/server";

const relevantEvents = new Set([
    'product.created',
    'product.update',
    'price.created',
    'price.update',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

export async function POST(
    request: Request
){
    const body = await request.text();
    const sig = headers().get('Stripe-Signature')

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try{
        if(!sig || webhookSecret) return;
        //@ts-ignore
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch(error:any) {
        console.log("error message: "+ error.message)
        return new NextResponse(`webhook error: ${error.message}`, {status:400});
    }

    if(relevantEvents.has(event.type))
    try{
        switch(event.type){
            case 'product.created':
            case 'product.updated':
                await upsertProductRecord(event.data.object as Stripe.Product)
                break;
            case 'price.created':
            case 'price.update':
                await upsertPriceRecorc(event.data.object as Stripe.Price);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.created':
            case 'customer.subscription.created':
                const subscription = event.data.object as Stripe.Subscription;
                await manageSuscriptionStatusChange(
                    subscription.id,
                    subscription.customer as string,
                    event.type === "customer.subscription.created"
                )
            case 'checkout.session.completed':
                const checkoutSession = event.data.object as Stripe.Checkout.Session;
                if(checkoutSession.mode === 'subscription'){
                    const subscriptionId = checkoutSession.subscription;
                    await manageSuscriptionStatusChange(
                        subscriptionId as string,
                        checkoutSession.customer as string,
                        false
                    )
                };
                break;
            default:
                throw new Error("Unhandled relevant event!!");
        }
    }catch(error){
        console.log(error)       
        return new NextResponse('webhook error', {status:400})
    }

    return NextResponse.json({received: true}, {status: 200})
}

