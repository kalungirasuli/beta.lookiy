import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Img,
} from '@react-email/components';

interface WaitlistWelcomeEmailProps {
  userName?: string;
}

export const WaitlistWelcomeEmail = ({
  userName = 'There',
}: WaitlistWelcomeEmailProps) => {
  const previewText = `Welcome to Lookiy, ${userName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Header */}
          <Section style={logoSection}>
            <Img
              src="https://lookiy.net/logomin.png"
              alt="Lookiy Logo"
              style={logo}
              loading='lazy'
              width={250}
              height={250}
            />
          </Section>

          {/* Hero Section with Orange Gradient Header */}
          <Section style={heroSection}>
            <Text style={heroText}>Welcome to Lookiy</Text>
            <Text style={heroSubtext}>You're on the Waitlist! 🎉</Text>
          </Section>

          {/* Main Card with Black Border and Shadow */}
          <Section style={cardSection}>
            {/* Greeting */}
            <Text style={greeting}>Hello {userName},</Text>
            
            <Text style={bodyText}>
              Thank you for joining the Lookiy waitlist! We're absolutely thrilled to have you on board. 
              You've secured your spot for early access when we launch.
            </Text>

            {/* Divider */}
            <Section style={divider} />

            {/* What to Expect Section */}
            <Section style={sectionBlock}>
              <Text style={sectionTitle}>📋 What's Next?</Text>
              
              <Section style={featureGrid}>
                <Row style={featureRow}>
                  <Section style={featureItem}>
                    <Text style={featureEmoji}>✨</Text>
                    <Text style={featureName}>Early Access</Text>
                    <Text style={featureDesc}>
                      Be among the first to experience the Lookiy platform when we launch.
                    </Text>
                  </Section>
                </Row>

                <Row style={featureRow}>
                  <Section style={featureItem}>
                    <Text style={featureEmoji}>📬</Text>
                    <Text style={featureName}>Exclusive Updates</Text>
                    <Text style={featureDesc}>
                      Receive exclusive updates about features, milestones, and launch announcements.
                    </Text>
                  </Section>
                </Row>

                <Row style={featureRow}>
                  <Section style={featureItem}>
                    <Text style={featureEmoji}>🎁</Text>
                    <Text style={featureName}>Special Perks</Text>
                    <Text style={featureDesc}>
                      Waitlist members get exclusive benefits and rewards at launch.
                    </Text>
                  </Section>
                </Row>
              </Section>
            </Section>

            {/* Divider */}
            <Section style={divider} />

            {/* Stay Updated Section */}
            <Section style={sectionBlock}>
              <Text style={sectionTitle}>🌐 Stay Updated</Text>
              <Text style={bodyText}>
                Follow our journey and stay in the loop about exciting updates, behind-the-scenes content, 
                and launch announcements by connecting with us on social media.
              </Text>
              <Text style={bodyText}>
                In the meantime, feel free to explore more about Lookiy or reach out if you have any questions!
              </Text>
            </Section>

            {/* CTA Button with Shadow */}
            <Section style={ctaSection}>
              <Button style={ctaButton} href="https://lookiy.net">
                Discover Lookiy
              </Button>
            </Section>

            {/* Divider */}
            <Section style={divider} />

            {/* Additional Info */}
            <Section style={infoBox}>
              <Text style={infoTitle}>Need Help?</Text>
              <Text style={infoText}>
                Have questions or feedback? We'd love to hear from you! 
                <Link href="https://lookiy.net/support" style={link}>
                  {' '}Contact our support team
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Lookiy. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://lookiy.net" style={footerLink}>
                Website
              </Link>
              {' • '}
              <Link href="https://lookiy.net/policy" style={footerLink}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href="https://lookiy.net/support" style={footerLink}>
                Support
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistWelcomeEmail;

/* Styles - Neo-Brutalist Design with Orange Theme Matching Lookiy Components */
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '20px',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  padding: '0',
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '24px 20px',
  backgroundColor: '#ffffff',
};

const logo = {
  maxWidth: '120px',
  height: 'auto',
  margin: '0 auto',
};

const heroSection = {
  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  padding: '60px 40px',
  textAlign: 'center' as const,
  border: '2px solid #000000',
  borderBottom: 'none',
  boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.15)',
};

const heroText = {
  color: '#ffffff',
  fontSize: '42px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  padding: '0',
  lineHeight: '1.2',
};

const heroSubtext = {
  color: '#fed7aa',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0',
  padding: '0',
  lineHeight: '1.2',
};

const cardSection = {
  backgroundColor: '#ffffff',
  padding: '48px 40px',
  border: '2px solid #000000',
  boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.15)',
};

const greeting = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 24px 0',
  padding: '0',
};

const bodyText = {
  fontSize: '16px',
  color: '#4b5563',
  lineHeight: '1.7',
  margin: '0 0 20px 0',
  padding: '0',
};

const divider = {
  borderTop: '2px solid #e5e7eb',
  margin: '32px 0',
  padding: '0',
};

const sectionBlock = {
  margin: '32px 0',
  padding: '0',
};

const sectionTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 24px 0',
  padding: '0',
};

const featureGrid = {
  margin: '0',
  padding: '0',
};

const featureRow = {
  margin: '0 0 24px 0',
  padding: '0',
};

const featureItem = {
  padding: '20px',
  backgroundColor: '#fffbeb',
  border: '2px solid #fde68a',
  borderRadius: '8px',
  margin: '0',
};

const featureEmoji = {
  fontSize: '32px',
  margin: '0 0 12px 0',
  padding: '0',
  display: 'block',
};

const featureName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 8px 0',
  padding: '0',
};

const featureDesc = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0',
  padding: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '32px 0 0 0',
};

const ctaButton = {
  backgroundColor: '#f97316',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
  border: '2px solid #000000',
  boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
  cursor: 'pointer',
};

const infoBox = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  border: '2px solid #f97316',
  borderRadius: '8px',
  margin: '32px 0',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#b45309',
  margin: '0 0 12px 0',
  padding: '0',
};

const infoText = {
  fontSize: '14px',
  color: '#92400e',
  lineHeight: '1.6',
  margin: '0',
  padding: '0',
};

const link = {
  color: '#ea580c',
  textDecoration: 'underline',
  fontWeight: '600',
};

const footerSection = {
  textAlign: 'center' as const,
  padding: '32px 40px 0 40px',
  borderTop: '1px solid #e5e7eb',
  marginTop: '32px',
};

const footerText = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '0 0 12px 0',
  padding: '0',
};

const footerLinks = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '0',
  padding: '0',
};

const footerLink = {
  color: '#f97316',
  textDecoration: 'none',
  fontWeight: '600',
};
