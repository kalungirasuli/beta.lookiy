# SendGrid Setup Guide for Lookiy Waitlist

## Overview

SendGrid is used to send professional, reliable emails to your waitlist subscribers. It's free for up to 100 emails/day and scales to millions.

## Step-by-Step Setup

### 1. Create SendGrid Account

1. Go to [SendGrid Sign Up](https://signup.sendgrid.com/)
2. Create a free account
3. Verify your email address
4. Complete the setup wizard

### 2. Create API Key

1. Log in to [SendGrid Dashboard](https://app.sendgrid.com)
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **Create API Key** button
4. Give it a name like "Lookiy Waitlist"
5. Select **Full Access** permissions
6. Click **Create & Copy**
7. Save this key somewhere secure (you'll need it in 1 minute)

### 3. Verify Sender Email

SendGrid requires you to verify who's sending emails. Choose one:

#### Option A: Verify Your Email (Fastest for Testing)
1. In SendGrid Dashboard, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - From Email: `your-email@example.com`
   - From Name: `Lookiy Team`
   - Reply To: `support@lookiy.com`
4. Click **Create**
5. Check your email for verification link
6. Click the link to verify

#### Option B: Verify Domain (Better for Production)
1. In SendGrid Dashboard, go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow DNS setup instructions
4. Once verified, use domain emails like `noreply@lookiy.com`

### 4. Set Environment Variables

Create `.env.local` in your project root:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@lookiy.com
SENDGRID_REPLY_TO=support@lookiy.com

# Firebase (already set up)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Important:** Replace the email addresses with your actual domain or verified sender email.

### 5. Test the Setup

```bash
# Start development server
npm run dev

# Navigate to Homecoming page
# Fill the form with test email
# Check inbox for welcome email
```

## How It Works

1. **User submits form** → Form validates input
2. **Form sends POST** to `/api/waitlist`
3. **API validates & stores** data in Firebase
4. **API renders email** template with React Email
5. **SendGrid sends email** to subscriber
6. **User receives** personalized welcome email

## Email Template

The email sent to subscribers includes:

✅ Purple gradient header matching your brand  
✅ Personalized greeting with subscriber's name  
✅ Benefits section with icons  
✅ Call-to-action button  
✅ Professional footer  
✅ Mobile responsive design  

## Common Issues & Solutions

### "API key is invalid"
- Copy your API key exactly from SendGrid dashboard
- Make sure you copied it immediately after creation
- Create a new key if needed and update `.env.local`
- Restart your dev server after updating `.env.local`

### "Email address not verified"
- Go to SendGrid **Settings** → **Sender Authentication**
- Verify your sender email address
- Use only verified email addresses in `SENDGRID_FROM_EMAIL`
- In production, verify your domain for best deliverability

### "Emails going to spam"
- Verify your domain (Option B above)
- Use consistent from name and email
- Ensure Reply-To email is correct
- SendGrid reputation takes time to build

### "401 Unauthorized"
- Check `SENDGRID_API_KEY` has no typos
- Verify it's a valid, active API key
- Create new key if old one expired
- Restart dev server

## Monitoring & Analytics

### Track Email Delivery

1. Go to SendGrid Dashboard
2. Click **Mail Send** → **Statistics**
3. View:
   - Emails delivered
   - Bounces
   - Opens
   - Clicks

### Check Email Logs

1. Go to **Mail Send** → **Event Logs**
2. Search by recipient email
3. See detailed delivery status

## Production Tips

### Before Going Live

- [ ] Verify your domain (for better deliverability)
- [ ] Test with multiple email addresses
- [ ] Check spam folder (usually works now)
- [ ] Monitor initial delivery rates
- [ ] Set up bounce handling
- [ ] Configure unsubscribe options if needed

### Scale with Confidence

SendGrid handles:
- ✅ Millions of emails
- ✅ Bounce management
- ✅ Spam filtering
- ✅ Bounce handling
- ✅ Email validation

## Free Plan Details

SendGrid's free tier includes:

- **100 emails/day** (plenty for testing)
- Full feature access
- Email validation
- Basic analytics
- No credit card required

Upgrade when you need more volume.

## Customizing Emails

### Change "From" Email

Edit `.env.local`:
```env
SENDGRID_FROM_EMAIL=your-address@yourdomain.com
```

### Change "Reply To" Email

Edit `.env.local`:
```env
SENDGRID_REPLY_TO=support@yourdomain.com
```

### Customize Email Content

Edit `src/emails/WaitlistWelcome.tsx`:
- Change colors, text, layout
- Add/remove sections
- Customize buttons

## API Reference

### SendGrid Integration

The API uses `@sendgrid/mail` library:

```typescript
await sgMail.send({
  to: email,                           // Recipient email
  from: process.env.SENDGRID_FROM_EMAIL,    // Sender email
  replyTo: process.env.SENDGRID_REPLY_TO,   // Reply-to address
  subject: 'Welcome to Lookiy',        // Email subject
  html: emailHtml,                     // Email body (HTML)
});
```

## Next Steps

1. ✅ Create SendGrid account
2. ✅ Create API key
3. ✅ Verify sender email
4. ✅ Add to `.env.local`
5. ✅ Test form submission
6. ✅ Deploy to production
7. ✅ Monitor delivery rates

## Support

For SendGrid issues, visit:
- [SendGrid Documentation](https://docs.sendgrid.com)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference)
- [SendGrid Help Center](https://support.sendgrid.com)

---

**Status:** Ready for Email Sending  
**Library:** @sendgrid/mail v8.x  
**Updated:** November 18, 2025
