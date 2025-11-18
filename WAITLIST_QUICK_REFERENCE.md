# Waitlist Quick Reference

## Environment Variables Needed

Copy to `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# SendGrid Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@lookiy.com
SENDGRID_REPLY_TO=support@lookiy.com
```

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start
```

## File Locations

| File | Purpose |
|------|---------|
| `src/emails/WaitlistWelcome.tsx` | Email template (purple gradient) |
| `src/app/api/waitlist/route.ts` | API endpoint |
| `src/lib/firebase.ts` | Firebase config |
| `src/components/JoinWaitingListForm.tsx` | Form component |
| `.env.local.example` | Environment template |
| `WAITLIST_SETUP.md` | Full setup guide |

## Testing Workflow

1. Fill in `.env.local` with Firebase credentials
2. Get Gmail app password
3. Run `npm run dev`
4. Go to Homecoming page
5. Submit form with test email
6. Check inbox for welcome email
7. Verify data in Firebase

## Email Features

✅ Purple gradient header  
✅ Personalized greeting  
✅ Benefits section with icons  
✅ Professional design  
✅ Mobile responsive  
✅ Fully customizable  

## API Endpoints

**POST /api/waitlist**
- Subscribe user to waitlist
- Returns: 201 (success), 400 (invalid), 409 (duplicate), 500 (error)

**GET /api/waitlist?email=...**
- Check subscription status
- Returns: true/false

## Customization

### Change Email Design
Edit `src/emails/WaitlistWelcome.tsx`:
- Change gradient colors
- Update benefits
- Modify button style
- Add social links

### Change Form Design
Edit `src/components/JoinWaitingListForm.tsx`:
- Modify input styles
- Change button colors
- Update success message

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check SENDGRID_API_KEY, verify sender email in SendGrid dashboard |
| Firebase error | Verify all NEXT_PUBLIC_FIREBASE_* vars set |
| Duplicate error | This is correct - 409 status means email exists |
| Form not submitting | Check browser console for errors |

## Success Checklist

- [ ] Firebase credentials in `.env.local`
- [ ] Gmail app password configured
- [ ] `npm run dev` runs without errors
- [ ] Form submits successfully
- [ ] Email received in inbox
- [ ] Data appears in Firestore
- [ ] Duplicate detection works
- [ ] Ready for production
