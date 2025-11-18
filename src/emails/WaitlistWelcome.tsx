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
} from 'react-email';

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
          {/* Header with purple gradient background */}
          <Section style={header}>
            <Text style={headerText}>Welcome to Lookiy</Text>
            <Text style={subheaderText}>You&apos;re on the waitlist! 🎉</Text>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Text style={greeting}>Hello {userName},</Text>
            
            <Text style={bodyText}>
              Thank you for joining our waitlist! We&apos;re thrilled to have you as part of our community. 
              You&apos;re now in line for early access to Lookiy when we launch.
            </Text>

            {/* Benefits section */}
            <Section style={benefitsSection}>
              <Text style={benefitsTitle}>What&apos;s Next?</Text>
              
              <Row style={benefitItem}>
                <Text style={benefitIcon}>✨</Text>
                <Text style={benefitText}>
                  <strong>Early Access:</strong> Be among the first to experience Lookiy when we launch.
                </Text>
              </Row>

              <Row style={benefitItem}>
                <Text style={benefitIcon}>📬</Text>
                <Text style={benefitText}>
                  <strong>Exclusive Updates:</strong> Get notified about new features and milestones.
                </Text>
              </Row>

              <Row style={benefitItem}>
                <Text style={benefitIcon}>🎁</Text>
                <Text style={benefitText}>
                  <strong>Special Perks:</strong> Waitlist members get exclusive benefits when we launch.
                </Text>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Button style={ctaButton} href="https://lookiy.com">
                Visit Lookiy
              </Button>
            </Section>

            <Text style={bodyText}>
              In the meantime, feel free to follow us on social media to stay updated on our progress.
              We can&apos;t wait to show you what we&apos;ve been building!
            </Text>

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                © {new Date().getFullYear()} Lookiy. All rights reserved.
              </Text>
              <Text style={footerLinks}>
                <Link href="https://lookiy.net" style={link}>
                  Website
                </Link>
                {' | '}
                <Link href="https://lookiy.net" style={link}>
                  Support us
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistWelcomeEmail;

/* Styles */
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const headerText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  padding: '0',
};

const subheaderText = {
  color: '#f3e8ff',
  fontSize: '18px',
  margin: '0',
  padding: '0',
};

const content = {
  padding: '40px 20px',
  background: '#ffffff',
  borderRadius: '0 0 8px 8px',
};

const greeting = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px 0',
  padding: '0',
};

const bodyText = {
  fontSize: '16px',
  color: '#4b5563',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  padding: '0',
};

const benefitsSection = {
  margin: '32px 0',
  padding: '20px',
  background: '#f9fafb',
  borderRadius: '6px',
  borderLeft: '4px solid #8b5cf6',
};

const benefitsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px 0',
  padding: '0',
};

const benefitItem = {
  margin: '12px 0',
  display: 'flex',
  alignItems: 'flex-start',
};

const benefitIcon = {
  fontSize: '20px',
  marginRight: '12px',
  color: '#8b5cf6',
  minWidth: '24px',
};

const benefitText = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.5',
  margin: '0',
  padding: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '24px 0',
};

const ctaButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: '2px solid #8b5cf6',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderTop: '1px solid #e5e7eb',
  marginTop: '24px',
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '8px 0',
  padding: '0',
};

const footerLinks = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '8px 0',
  padding: '0',
};

const link = {
  color: '#8b5cf6',
  textDecoration: 'underline',
};
