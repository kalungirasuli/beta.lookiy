# Firestore Security Rules Setup

## Current Issue
The API is failing with "Missing or insufficient permissions" because Firestore security rules are preventing unauthenticated writes.

## Solution
Update your Firestore security rules to allow writes to the waitlist collection:

### Go to Firebase Console:
1. Navigate to: https://console.firebase.google.com
2. Select your project: `lookiy-818c7`
3. Go to: **Firestore Database** → **Rules**
4. Replace the rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read/write to waitlist for now
    match /waitlist/{document=**} {
      allow read, write: if true;
    }
    
    // Add other collections here as needed
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## For Production
Once you want to secure the database, you can:
- Require authentication
- Validate email format
- Rate limit submissions
- Add custom claims for authorization

Example production rules:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist/{document=**} {
      allow create: if request.resource.data.email is string 
        && request.resource.data.email.matches('.*@.*\\..*')
        && request.resource.data.name is string
        && request.resource.data.type is string;
      allow read, update, delete: if false;
    }
  }
}
```

## Testing
After updating rules:
1. Try submitting the waitlist form
2. Check the browser console for the full error
3. Check the server logs (terminal) for the detailed logging
