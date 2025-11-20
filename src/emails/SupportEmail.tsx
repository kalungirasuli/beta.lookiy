import { Html, Body, Head, Heading, Text, Container, Section, Button, Link, Img, Row, Column } from '@react-email/components';

const baseUrl = 'https://lookiy.net';

export const SupportEmailTemplate = ({ userName, supportType }: { userName: string; supportType: string }) => {
  const supportTypeLabels: Record<string, string> = {
    'feedback': '💬 Feedback',
    'testing': '🧪 Beta Testing',
    'promotion': '📢 Help Promote',
    'investment': '💰 Investment Opportunities',
    'other': '📧 Other Inquiry',
  };

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header with Logo and Gradient */}
          <Section style={headerStyle}>
            <Row>
              <Column align="center">
                <Img 
                  src={`${baseUrl}/logo.svg`} 
                  width="40" 
                  height="40" 
                  alt="Lookiy Logo"
                  style={logoStyle}
                />
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Heading style={heroTitleStyle}>Thank You, {userName}!</Heading>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            <Text style={paragraphStyle}>
              We've received your support request and appreciate your interest in Lookiy.
            </Text>

            {/* Support Type Info */}
            <Section style={infoBoxStyle}>
              <Text style={labelStyle}>Support Type:</Text>
              <Heading style={typeHeadingStyle}>
                {supportTypeLabels[supportType] || supportType}
              </Heading>
            </Section>

            <Text style={paragraphStyle}>
              Our team will review your request and get back to you within 24-48 hours. We value your engagement and feedback as we continue to build Lookiy.
            </Text>

            {/* Next Steps */}
            <Section style={stepsStyle}>
              <Heading style={sectionTitleStyle}>What Happens Next?</Heading>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  <Text style={listTextStyle}>
                    <strong>📧 Confirmation:</strong> You'll receive a confirmation of your request to this email address.
                  </Text>
                </li>
                <li style={listItemStyle}>
                  <Text style={listTextStyle}>
                    <strong>👀 Review:</strong> Our team will review your request and determine next steps.
                  </Text>
                </li>
                <li style={listItemStyle}>
                  <Text style={listTextStyle}>
                    <strong>📬 Follow-up:</strong> We'll reach out to you with updates and any additional information needed.
                  </Text>
                </li>
              </ul>
            </Section>

            {/* CTA Button */}
            <Section style={ctaContainerStyle}>
              <Button 
                style={buttonStyle}
                href={`${baseUrl}`}
              >
                Visit Lookiy
              </Button>
            </Section>

            {/* Contact Info */}
            <Section style={contactBoxStyle}>
              <Heading style={contactTitleStyle}>Questions?</Heading>
              <Text style={contactTextStyle}>
                Reach out to us at{' '}
                <Link href="mailto:support@lookiy.net" style={linkStyle}>
                  support@lookiy.net
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Lookiy. All rights reserved.
            </Text>
            <Text style={footerSubtextStyle}>
              Building connections that matter.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  padding: '40px 20px',
  borderTop: '2px solid #000000',
};

const logoStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const heroTitleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center',
};

const contentStyle: React.CSSProperties = {
  padding: '40px 30px',
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 16px 0',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '24px 0 16px 0',
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#fef3c7',
  border: '2px solid #000000',
  padding: '20px',
  margin: '20px 0',
  boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#7c2d12',
  textTransform: 'uppercase',
  margin: '0 0 8px 0',
};

const typeHeadingStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const stepsStyle: React.CSSProperties = {
  margin: '24px 0',
};

const listStyle: React.CSSProperties = {
  margin: '12px 0',
  paddingLeft: '20px',
};

const listItemStyle: React.CSSProperties = {
  marginBottom: '12px',
};

const listTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#f97316',
  color: '#ffffff',
  padding: '12px 32px',
  fontSize: '14px',
  fontWeight: 'bold',
  border: '2px solid #000000',
  borderRadius: '6px',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
};

const contactBoxStyle: React.CSSProperties = {
  backgroundColor: '#fef3c7',
  border: '2px solid #000000',
  padding: '20px',
  margin: '24px 0',
  boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
};

const contactTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 12px 0',
};

const contactTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
};

const linkStyle: React.CSSProperties = {
  color: '#f97316',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  padding: '24px 30px',
  textAlign: 'center' as const,
  borderTop: '2px solid #000000',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 8px 0',
};

const footerSubtextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
};
