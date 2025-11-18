# Lookiy Waitlist - Setup Guide

## Overview

Your waitlist system is now fully integrated with:
- **Firebase Firestore** - for storing subscriber data
- **SendGrid** - for sending professional emails
- **React Email** - for creating beautiful, responsive email templates
- **Custom Email Design** - matching Lookiy's purple gradient theme

## Quick Setup (5 minutes)

### Step 1: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. In Firestore, create a collection named `waitlist`
6. Copy these values from Project Settings to `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 2: Email Configuration

#### Using SendGrid (Recommended):
1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Create an account (free tier available)
3. Go to **API Keys** → **Create API Key**
4. Copy the API key
5. Verify a sender email (or use SendGrid domain)
6. Update `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@lookiy.com
   SENDGRID_REPLY_TO=support@lookiy.com
   ```

**Note:** Replace the email addresses with your actual domain or verify a sender address in SendGrid.

### Step 3: Create `.env.local`

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### Step 4: Test Locally

```bash
npm run dev
```

Navigate to the Homecoming page and test the form:
1. Enter a name and email
2. Click "Join the Waitlist"
3. Check your inbox for the welcome email
4. Verify data in Firebase Firestore

## Firestore Security Rules

Add these security rules to your Firestore database:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.resource.data.email != null && 
                       request.resource.data.name != null;
      allow update, delete: if false;
    }
  }
}
```

## File Structure

```
src/
├── emails/
│   └── WaitlistWelcome.tsx         # Email template with purple gradient
├── lib/
│   └── firebase.ts                 # Firebase initialization
├── app/
│   └── api/
│       └── waitlist/
│           └── route.ts            # API endpoint (POST/GET)
└── components/
    └── JoinWaitingListForm.tsx      # Form component with API integration
```

## API Reference

### POST /api/waitlist
Subscribe a user to the waitlist

**Request:**
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed to waitlist",
  "data": {
    "id": "doc_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subscribedAt": "2025-11-18T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing fields or invalid email
- `409` - Email already on waitlist
- `500` - Server error

### GET /api/waitlist?email=test@example.com
Check if an email is on the waitlist

**Response:**
```json
{
  "subscribed": true,
  "data": {
    "id": "doc_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subscribedAt": "2025-11-18T12:00:00.000Z",
    "status": "active"
  }
}
```

## Email Template Design

The email template (`WaitlistWelcome.tsx`) includes:
- **Purple gradient header** matching your brand
- **Personalized greeting** with subscriber's first name
- **Benefits section** with icons and descriptions
- **Call-to-action button** linking to your website
- **Professional footer** with links
- **Fully responsive** design for all devices

### Customizing the Email

Edit `src/emails/WaitlistWelcome.tsx`:
- Change the `header` gradient background
- Update the benefits section
- Modify button colors and links
- Add your social media links

## Troubleshooting

### Email not sending
- Verify `SENDGRID_API_KEY` is correct
- Ensure sender email is verified in SendGrid dashboard
- Check that email service is not in test mode
- Review SendGrid activity logs for bounce/error details

### Firebase connection error
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check that Firestore database is created
- Ensure security rules allow writes
- Restart dev server after changing env vars

### Duplicate email error
- This is expected behavior - users can't subscribe twice
- The API returns 409 status with appropriate message

### Email template not rendering
- Check that `react-email` is installed: `npm list react-email`
- Ensure email client supports HTML email
- Try a different email address to test

## Deployment

### Vercel
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - All `NEXT_PUBLIC_FIREBASE_*` variables
   - `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_REPLY_TO`
4. Deploy - automatic on push

### Netlify
1. Push code to GitHub
2. Connect repo to Netlify
3. Add environment variables in Netlify UI
4. Deploy - automatic on push

### Self-Hosted
```bash
npm run build
npm run start
```
Ensure environment variables are set on your server.

## Security Considerations

1. **Never commit `.env.local`** - it contains sensitive credentials
2. **Use app-specific passwords** for Gmail instead of account password
3. **Enable Firestore security rules** to prevent unauthorized access
4. **Validate input** on both client and server (already implemented)
5. **Use HTTPS** in production
6. **Monitor Firebase usage** to prevent quota abuse

## Monitoring

Track in your Firebase Console:
- Number of documents in `waitlist` collection
- Storage usage
- Read/write operations

Monitor email delivery:
- Check spam folders
- Set up email bounce handling
- Track open rates if integrated with email service

## Next Steps

1. ✅ Configure Firebase credentials
2. ✅ Set up Gmail app password
3. ✅ Create `.env.local` with all variables
4. ✅ Test form submission locally
5. ✅ Verify email receipt and Firebase storage
6. ✅ Deploy to production platform
7. ✅ Monitor subscriber growth

## Support

For issues or questions:
- Check Firebase Console for error logs
- Review server console output during testing
- Verify all environment variables are set
- Test API endpoints manually with curl or Postman
