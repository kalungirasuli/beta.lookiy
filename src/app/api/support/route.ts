import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import React from 'react';
import { render } from '@react-email/render';
import { SupportEmailTemplate } from '@/emails/SupportEmail';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

console.log('📍 [SUPPORT API] API Route initialized');
console.log('📍 [SUPPORT API] Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('📍 [SUPPORT API] SendGrid API Key present:', !!process.env.SENDGRID_API_KEY);

export async function POST(request: NextRequest) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🚀 [SUPPORT API POST] Request started at', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    console.log('📍 [SUPPORT API] Parsing request body...');
    const { name, email, supportType, message } = await request.json();
    console.log('📍 [SUPPORT API] Received data:', { name, email, supportType, message });

    // Validate input
    if (!name || !email || !supportType) {
      console.log('❌ [SUPPORT API] Validation failed: Missing required fields');
      return NextResponse.json(
        { message: 'Name, email, and support type are required' },
        { status: 400 }
      );
    }
    console.log('✅ [SUPPORT API] Basic validation passed');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [SUPPORT API] Email validation failed:', email);
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.log('✅ [SUPPORT API] Email format validation passed');

    // Add to Firestore
    console.log('📍 [SUPPORT API] Saving to Firestore...');
    const supportCollection = collection(db, 'support_requests');
    const docRef = await addDoc(supportCollection, {
      name: name.trim(),
      email: email.toLowerCase(),
      supportType: supportType.trim(),
      message: message?.trim() || '',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    });
    console.log('✅ [SUPPORT API] Successfully saved to Firestore with ID:', docRef.id);

    // Render email template
    console.log('📍 [SUPPORT API] Rendering email template...');
    let emailHtml = '';
    try {
      emailHtml = await render(
        React.createElement(SupportEmailTemplate, {
          userName: name.trim().split(' ')[0],
          supportType: supportType,
        })
      );
      console.log('✅ [SUPPORT API] Email template rendered successfully');
    } catch (emailRenderError) {
      console.error('❌ [SUPPORT API] Email render error:', emailRenderError);
      // Use fallback simple email if rendering fails
      emailHtml = `
        <h1>Thank you for reaching out, ${name.trim().split(' ')[0]}!</h1>
        <p>We've received your support request and will review it shortly.</p>
        <p>Support Type: ${supportType}</p>
        <p>We appreciate your interest in supporting Lookiy!</p>
      `;
      console.log('⚠️ [SUPPORT API] Using fallback email template');
    }

    // Send confirmation email via SendGrid
    console.log('📍 [SUPPORT API] Sending confirmation email via SendGrid...');
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'info@lookiy.net',
        replyTo: process.env.SENDGRID_REPLY_TO || 'support@lookiy.net',
        subject: `Support Request Received - Lookiy`,
        html: emailHtml,
      });
      console.log('✅ [SUPPORT API] Confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ [SUPPORT API] Email sending error:', emailError);
      console.log('⚠️ [SUPPORT API] Email failed but request was saved to Firestore');
      // Don't fail the request if email fails - the data is saved in Firestore
    }

    // Send notification email to admin
    console.log('📍 [SUPPORT API] Sending admin notification...');
    try {
      const adminHtml = `
        <h2>New Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type:</strong> ${supportType}</p>
        <p><strong>Message:</strong></p>
        <p>${message?.trim() || 'No additional details provided'}</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        <p><strong>Firestore ID:</strong> ${docRef.id}</p>
      `;

      await sgMail.send({
        to: process.env.SUPPORT_ADMIN_EMAIL || 'admin@lookiy.net',
        from: process.env.SENDGRID_FROM_EMAIL || 'info@lookiy.net',
        subject: `New Support Request - ${supportType}`,
        html: adminHtml,
      });
      console.log('✅ [SUPPORT API] Admin notification sent successfully');
    } catch (adminEmailError) {
      console.error('❌ [SUPPORT API] Admin email error:', adminEmailError);
      console.log('⚠️ [SUPPORT API] Admin notification failed but request was saved');
      // Don't fail - the data is already in Firestore
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ [SUPPORT API] Request completed successfully');
    console.log('═══════════════════════════════════════════════════════════\n');

    return NextResponse.json(
      { 
        message: 'Thank you! Your support request has been received.',
        id: docRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('\n❌ [SUPPORT API] Unexpected error:', error);
    console.log('═══════════════════════════════════════════════════════════\n');
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('📍 [SUPPORT API GET] Checking support request status...');
  
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log('📍 [SUPPORT API] Looking up email:', email);
    const supportCollection = collection(db, 'support_requests');
    const q = query(supportCollection, where('email', '==', email.toLowerCase()));
    const docs = await getDocs(q);

    if (docs.empty) {
      console.log('ℹ️ [SUPPORT API] No support requests found for email:', email);
      return NextResponse.json(
        { found: false, message: 'No support requests found for this email' },
        { status: 200 }
      );
    }

    console.log('✅ [SUPPORT API] Found', docs.size, 'support request(s)');
    const requests = docs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { found: true, requests },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [SUPPORT API] GET Error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
