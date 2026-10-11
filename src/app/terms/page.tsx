import type { Metadata } from 'next';
import { LegalDoc } from '@/components/legal-doc';

export const metadata: Metadata = { title: 'Terms & Conditions — Lookiy', description: 'The terms and conditions that govern your use of the Lookiy platform.' };

export default function TermsPage() {
  return <LegalDoc
    eyebrow="LEGAL"
    title="Terms & conditions."
    updated="5 October 2026"
    effective="5 October 2026"
    intro={<>These Terms and Conditions (<strong>“Terms”</strong>) form a legally binding agreement between you and <strong>Lookiy</strong> (“Lookiy”, “we”, “us”, “our”) governing your access to and use of the Lookiy website, mobile applications, and related services (together, the <strong>“Platform”</strong>). Please read them carefully before using the Platform.</>}
    sections={[
      { id: 'agreement', title: 'Agreement & acceptance', content: <>
        <p>By creating an account, downloading the app, or otherwise accessing the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Platform.</p>
        <p>We may update these Terms from time to time. Where changes are material, we will notify you through the Platform or by other reasonable means. Your continued use after the effective date of any change constitutes acceptance of the revised Terms.</p>
      </> },
      { id: 'definitions', title: 'Definitions', content: <>
        <ul>
          <li><strong>“Platform”</strong> — the Lookiy website, mobile applications, and all associated services, features, and APIs.</li>
          <li><strong>“Client”</strong> — a user who requests a ride, delivery, or journey.</li>
          <li><strong>“Rider”</strong> or <strong>“Operator”</strong> — a verified user who provides transport using their vehicle.</li>
          <li><strong>“Fleet”</strong> or <strong>“Company”</strong> — an organisation that manages vehicles and operators on the Platform.</li>
          <li><strong>“Business”</strong> — a merchant that maintains a storefront or map presence on the Platform.</li>
          <li><strong>“Journey”</strong> — a ride, delivery, or transport request, from creation to completion.</li>
          <li><strong>“Fare”</strong> — the amount agreed between a Client and a Rider for a Journey.</li>
          <li><strong>“Mobile money”</strong> — payment services provided by licensed operators such as MTN MoMo and Airtel Money.</li>
        </ul>
      </> },
      { id: 'eligibility', title: 'Eligibility & accounts', content: <>
        <p>You must be at least 18 years old and capable of entering into a binding contract to use the Platform. By creating an account you represent that you meet these requirements.</p>
        <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You must provide accurate, current, and complete information and keep it up to date. You agree to notify us immediately of any unauthorised use of your account.</p>
        <p>We reserve the right to suspend or terminate accounts that breach these Terms, provide false information, or are used fraudulently.</p>
      </> },
      { id: 'services', title: 'The Lookiy services', content: <>
        <p>Lookiy is a technology platform that connects Clients with independent Riders for transport and delivery, and connects Users with Businesses for local discovery and commerce. Lookiy does not provide transport services itself and is not a common carrier. Riders are independent third parties and not employees of Lookiy.</p>
        <p>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Platform for your personal or business use, as applicable.</p>
      </> },
      { id: 'roles', title: 'User roles', content: <>
        <p>The Platform supports several roles. Your rights and obligations depend on your role:</p>
        <ul>
          <li><strong>Client</strong> — plan and request journeys, suggest fares, track journeys, and pay.</li>
          <li><strong>Rider / Operator</strong> — register a vehicle, receive and accept journey requests, and earn fares.</li>
          <li><strong>Fleet / Company</strong> — manage operators, vehicles, commissions, and settlements.</li>
          <li><strong>Business</strong> — maintain a storefront, run map advertising, and engage customers.</li>
        </ul>
        <p>Selecting a mode within the app does not change your account identity or grant backend roles. Certain features require verification or additional eligibility as described in these Terms.</p>
      </> },
      { id: 'fares', title: 'Fares & payments', content: <>
        <p>Clients may suggest a fare for a Journey or use the system estimate. Riders may accept the suggested fare or negotiate. The first acceptance locks the agreed fare for that Journey.</p>
        <p>Lookiy does not take a commission on ride fares. Riders keep 100% of the fare agreed with the Client. Lookiy instead charges the fees described below and in the “Rider fees” section.</p>
        <p>Payments are processed through licensed mobile money providers (MTN MoMo, Airtel Money) via our payment integration. You are responsible for any fees charged by your mobile money provider.</p>
        <p>All amounts are denominated in Ugandan Shillings (UGX) unless stated otherwise.</p>
      </> },
      { id: 'rider-fees', title: 'Rider verification & subscription fees', content: <>
        <p>To operate as a Rider you must complete vehicle registration and provide the required documents, including a national ID, driving licence, profile photo, vehicle registration, and insurance. You may work during a 14-day grace period from registration without a verified badge, provided your setup is complete. Reaching the deadline without verification blocks new requests.</p>
        <div className="legal-note">Riders pay a one-time verification fee of <strong>UGX 20,000</strong>, and a recurring subscription of <strong>UGX 5,000 per calendar week</strong>. Rides are otherwise commission-free.</div>
        <p>After verification, the current week&apos;s subscription is due before you can go online. Past-week payments do not unlock requests. Fees are deducted from your Lookiy wallet; you may top up using mobile money.</p>
        <p>We may modify fees on reasonable notice. Fee changes do not apply retroactively to journeys already in progress.</p>
      </> },
      { id: 'matching', title: 'Matching & journey locks', content: <>
        <p>Journey requests are matched to nearby Riders in waves. Before a journey starts, both the Client and Rider confirm a shared PIN or QR code. This dual confirmation locks the journey and protects both parties.</p>
        <p>You must not share your confirmation code with anyone other than the matched counterparty. Failing to confirm, or confirming a journey you do not intend to take, may lead to suspension.</p>
        <p>Journeys may include live tracking, deviation detection, and in-journey chat. You agree to use these features lawfully and respectfully.</p>
      </> },
      { id: 'cancellation', title: 'Cancellations & refunds', content: <>
        <p>Clients and Riders may cancel a journey in accordance with the cancellation options shown in the Platform. Repeated or abusive cancellations may affect your ability to use the Platform.</p>
        <p>Refunds, where applicable, are credited to the original payment method or your Lookiy wallet. Subscription and verification fees are non-refundable except as required by law.</p>
      </> },
      { id: 'acceptable-use', title: 'Acceptable use', content: <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Platform for any unlawful or fraudulent purpose;</li>
          <li>Impersonate any person or misrepresent your identity, vehicle, or credentials;</li>
          <li>Harass, threaten, or endanger other users;</li>
          <li>Interfere with the Platform&apos;s operation, security, or other users&apos; access;</li>
          <li>Attempt to circumvent fees, verification, or safety controls;</li>
          <li>Scrape, copy, or reverse-engineer any part of the Platform; or</li>
          <li>Provide false ratings, documents, or payment information.</li>
        </ul>
      </> },
      { id: 'safety', title: 'Safety & verification', content: <>
        <p>Rider identity verification (“KYC”) is required before a Rider badge is issued, and is performed through our verification partners. A verified badge indicates that documents were reviewed and approved; it is not a guarantee of individual conduct.</p>
        <p>Users should exercise reasonable care at all times and report any safety concern through the Platform or the in-app help channels. Lookiy may share information with law enforcement where required by law.</p>
      </> },
      { id: 'ratings', title: 'Ratings & feedback', content: <>
        <p>After a journey, Clients and Riders may rate one another. Ratings and reviews must be honest and based on first-hand experience. We may moderate or remove reviews that breach these Terms.</p>
      </> },
      { id: 'ip', title: 'Intellectual property', content: <>
        <p>All rights in the Platform, including its software, design, trademarks, and content (except user content), are owned by Lookiy or its licensors. You may not copy, modify, distribute, or create derivative works without our prior written consent.</p>
        <p>By submitting content to the Platform, you grant Lookiy a licence to use it to provide and improve the Platform, subject to our Privacy Policy.</p>
      </> },
      { id: 'third-party', title: 'Third-party services & links', content: <>
        <p>The Platform may integrate with or link to third-party services, including mobile money providers, identity verification services, and mapping services. We are not responsible for the availability, accuracy, or practices of third-party services. Your use of such services is subject to their own terms.</p>
      </> },
      { id: 'disclaimer', title: 'Disclaimers & limitation of liability', content: <>
        <p>To the maximum extent permitted by law, the Platform is provided “as is” and “as available”, without warranties of any kind. Lookiy does not guarantee uninterrupted, error-free, or secure operation, and disclaims responsibility for the acts or omissions of independent Riders, Businesses, and third parties.</p>
        <p>To the maximum extent permitted by law, Lookiy and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill, arising out of or related to these Terms or your use of the Platform, whether in contract, tort, or otherwise. Nothing in these Terms limits liability that cannot be limited under applicable law.</p>
      </> },
      { id: 'indemnity', title: 'Indemnification', content: <>
        <p>You agree to indemnify and hold harmless Lookiy and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising out of your use of the Platform, your breach of these Terms, or your violation of any law or third-party right.</p>
      </> },
      { id: 'termination', title: 'Termination & suspension', content: <>
        <p>You may stop using the Platform at any time and may request account deletion as described in our Privacy Policy. We may suspend or terminate your access if you breach these Terms, if required by law, or to protect the Platform or other users.</p>
        <p>Provisions that by their nature should survive termination (including fees owed, disclaimers, limitation of liability, and indemnification) will continue to apply.</p>
      </> },
      { id: 'governing-law', title: 'Governing law & disputes', content: <>
        <p>These Terms are governed by the laws of the Republic of Uganda. Any dispute shall first be raised with us for good-faith resolution. Where a dispute cannot be resolved, it shall be subject to the exclusive jurisdiction of the courts of Uganda.</p>
      </> },
      { id: 'changes', title: 'Changes to these terms', content: <>
        <p>We may revise these Terms at any time. We will provide notice of material changes by posting the updated Terms with a new effective date and, where appropriate, notifying you through the Platform. Continued use after the effective date constitutes acceptance.</p>
      </> },
      { id: 'contact', title: 'Contact us', content: <>
        <p>If you have questions about these Terms, please contact us at <a href="mailto:legal@lookiy.africa">legal@lookiy.africa</a> or through the in-app help channels.</p>
      </> },
    ]}
  />;
}
