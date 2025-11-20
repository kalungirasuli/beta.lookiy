import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import React from 'react';
import { render } from '@react-email/render';
import { WaitlistWelcomeEmail } from '@/emails/WaitlistWelcome';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

console.log('📍 [WAITLIST API] API Route initialized');
console.log('📍 [WAITLIST API] Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('📍 [WAITLIST API] SendGrid API Key present:', !!process.env.SENDGRID_API_KEY);
export async function POST(request: NextRequest) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🚀 [WAITLIST API POST] Request started at', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    console.log('📍 [WAITLIST API] Parsing request body...');
    const { name, email, type, companyName, companyDescription } = await request.json();
    console.log('📍 [WAITLIST API] Received data:', { name, email, type, companyName, companyDescription });

    // Validate input
    if (!name || !email || !type) {
      console.log('❌ [WAITLIST API] Validation failed: Missing required fields');
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }
    console.log('✅ [WAITLIST API] Basic validation passed');

    // Validate company fields if type is Company/Organization
    if (type === 'Company/Organization' && (!companyName || !companyDescription)) {
      console.log('❌ [WAITLIST API] Validation failed: Missing company fields');
      return NextResponse.json(
        { message: 'Company name and description are required for Company/Organization type' },
        { status: 400 }
      );
    }
    console.log('✅ [WAITLIST API] Company field validation passed');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [WAITLIST API] Email validation failed:', email);
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.log('✅ [WAITLIST API] Email format validation passed');

    // Check if email already exists in waitlist
    console.log('📍 [WAITLIST API] Checking for duplicate email in Firestore...');
    const waitlistCollection = collection(db, 'waitlist');
    const existingQuery = query(waitlistCollection, where('email', '==', email.toLowerCase()));
    const existingDocs = await getDocs(existingQuery);
    console.log('📍 [WAITLIST API] Duplicate check result:', existingDocs.size, 'documents found');

    if (!existingDocs.empty) {
      console.log('❌ [WAITLIST API] Email already exists in waitlist');
      return NextResponse.json(
        { message: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }
    console.log('✅ [WAITLIST API] No duplicates found - proceeding to save');

    // Add to Firestore
    console.log('📍 [WAITLIST API] Saving to Firestore...');
    const firestoreData: Record<string, string | boolean> = {
      name: name.trim(),
      email: email.toLowerCase(),
      type: type.trim(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };
    
    // Add company fields if provided
    if (type === 'Company/Organization') {
      firestoreData.companyName = companyName?.trim() || '';
      firestoreData.companyDescription = companyDescription?.trim() || '';
    }
    
    const docRef = await addDoc(waitlistCollection, firestoreData);
    console.log('✅ [WAITLIST API] Successfully saved to Firestore with ID:', docRef.id);

    // Render email template
    console.log('📍 [WAITLIST API] Rendering email template...');
    let emailHtml = '';
    try {
      emailHtml = await render(
        React.createElement(WaitlistWelcomeEmail, {
          userName: name.trim().split(' ')[0],
        })
      );
      console.log('✅ [WAITLIST API] Email template rendered successfully');
    } catch (emailRenderError) {
      console.error('❌ [WAITLIST API] Email render error:', emailRenderError);
      // Use fallback simple email if rendering fails
      emailHtml = `
        <h1>Welcome to Lookiy, ${name.trim().split(' ')[0]}!</h1>
        <p>Thanks for joining our waitlist. We're excited to have you on board!</p>
        <p>We'll notify you as soon as we launch.</p>
      `;
      console.log('⚠️ [WAITLIST API] Using fallback email template');
    }

    // Send email via SendGrid
    console.log('📍 [WAITLIST API] Sending email via SendGrid...');
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'info@lookiy.net',
        replyTo: process.env.SENDGRID_REPLY_TO || 'support@lookiy.net',
        subject: `Welcome to Lookiy, ${name.trim().split(' ')[0]}! 🎉`,
        html: emailHtml,
      });
      console.log('✅ [WAITLIST API] Email sent successfully to:', email);
    } catch (emailError) {
      console.error('⚠️ [WAITLIST API] SendGrid error:', emailError);
      // Don't fail the subscription if email sending fails
      // The user is still added to Firestore
      console.log('⚠️ [WAITLIST API] Email sending failed, but subscription is still valid');
    }

    console.log('\n✅ [WAITLIST API POST] Request completed successfully\n');
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to waitlist',
        data: {
          id: docRef.id,
          name,
          email,
          type,
          subscribedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('\n❌ [WAITLIST API] CRITICAL ERROR:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📍 [WAITLIST API] Starting GET request...');
    
    const email = request.nextUrl.searchParams.get('email');
    console.log('📍 [WAITLIST API] Received email parameter:', email);

    if (!email) {
      console.log('❌ [WAITLIST API] Email parameter is missing');
      return NextResponse.json(
        { message: 'Email parameter is required' },
        { status: 400 }
      );
    }
    console.log('✅ [WAITLIST API] Email parameter validation passed');

    console.log('📍 [WAITLIST API] Querying Firestore for email...');
    const waitlistCollection = collection(db, 'waitlist');
    const q = query(waitlistCollection, where('email', '==', email.toLowerCase()));
    const docs = await getDocs(q);
    console.log('📍 [WAITLIST API] Query result:', docs.size, 'documents found');

    if (docs.empty) {
      console.log('⚠️ [WAITLIST API] Email not found in waitlist');
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      );
    }

    const data = docs.docs[0].data();
    console.log('✅ [WAITLIST API] Email found in waitlist');
    console.log('📍 [WAITLIST API] Subscription data:', { 
      id: docs.docs[0].id, 
      name: data.name,
      email: data.email,
      type: data.type,
      status: data.status,
      subscribedAt: data.subscribedAt
    });

    console.log('✅ [WAITLIST API] GET request completed successfully');
    return NextResponse.json(
      {
        subscribed: true,
        data: {
          id: docs.docs[0].id,
          ...data,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [WAITLIST API] GET request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('❌ [WAITLIST API] Error details:', errorMessage);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
