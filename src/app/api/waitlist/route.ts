import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { render } from 'react-email';
import { WaitlistWelcomeEmail } from '@/emails/WaitlistWelcome';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists in waitlist
    const waitlistCollection = collection(db, 'waitlist');
    const existingQuery = query(waitlistCollection, where('email', '==', email.toLowerCase()));
    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      return NextResponse.json(
        { message: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Add to Firestore
    const docRef = await addDoc(waitlistCollection, {
      name: name.trim(),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    // Render email template
    const emailHtml = await render(
      WaitlistWelcomeEmail({ 
        userName: name.trim().split(' ')[0],
      })
    );

    // Send email via SendGrid
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@lookiy.com',
      replyTo: process.env.SENDGRID_REPLY_TO || 'noreply@lookiy.com',
      subject: `Welcome to Lookiy, ${name.trim().split(' ')[0]}! 🎉`,
      html: emailHtml,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to waitlist',
        data: {
          id: docRef.id,
          name,
          email,
          subscribedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist subscription error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const waitlistCollection = collection(db, 'waitlist');
    const q = query(waitlistCollection, where('email', '==', email.toLowerCase()));
    const docs = await getDocs(q);

    if (docs.empty) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      );
    }

    const data = docs.docs[0].data();
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
    console.error('Waitlist status check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
