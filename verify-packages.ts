/**
 * Package Verification
 * Verify all required packages are installed correctly
 */

import { version as reactEmailVersion } from 'react-email/package.json';
import {render} from '@react-email/render';

console.log('✅ react-email version:', reactEmailVersion);
console.log('✅ render function imported from react-email');

// Check SendGrid
import sgMail from '@sendgrid/mail';
console.log('✅ SendGrid imported successfully');

// Check Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
console.log('✅ Firebase imported successfully');

// Check form dependencies
import axios from 'axios';
console.log('✅ axios imported successfully');

import { motion } from 'framer-motion';
console.log('✅ framer-motion imported successfully');

console.log('\n✅ All packages verified successfully!');
