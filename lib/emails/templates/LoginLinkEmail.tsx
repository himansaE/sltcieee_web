import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface LoginLinkEmailProps {
  userName: string;
  loginLink: string;
}

export const LoginLinkEmail: React.FC<LoginLinkEmailProps> = ({
  userName,
  loginLink,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head>
        <title>Your Login Link</title>
        <Preview>Access your SLTC IEEE Admin Portal account</Preview>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoContainer}>
            <Img
              src="https://ypsl-newsletter.ieee.org/ieee_sltc_logo_icon.png"
              alt="SLTC IEEE Admin"
              width="150"
              height="auto"
              style={styles.logo}
            />
          </Section>

          <Section style={styles.mainSection}>
            <Heading style={styles.header}>Welcome to SLTC IEEE Admin</Heading>

            <Section style={styles.content}>
              <Text style={styles.greeting}>Hello {userName},</Text>

              <Text style={styles.paragraph}>
                Your account has been created on the SLTC IEEE Admin Portal. Use
                the link below to access your account:
              </Text>

              <Button
                style={{
                  ...styles.button,
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                }}
                href={loginLink}
              >
                Access Your Account
              </Button>

              <Text style={styles.expiry}>
                This link will expire in 24 hours for security reasons.
              </Text>

              <Text style={styles.paragraphSmall}>
                If the button doesn&apos;t work, copy and paste the following
                link into your browser:
              </Text>

              <Text style={styles.link}>{loginLink}</Text>

              <Text style={styles.signature}>
                Regards,
                <br />
                SLTC IEEE Administrator Team
              </Text>
            </Section>
          </Section>

          <Hr style={styles.divider} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              &copy; {currentYear} IEEE Sri Lanka Technological Campus. All
              rights reserved.
            </Text>
            <Text style={styles.footerText}>
              This is an automated message, please do not reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LoginLinkEmail;

// Styling
const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: "0",
    padding: "0",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  logoContainer: {
    textAlign: "center" as const,
    padding: "20px 0",
  },
  logo: {
    border: "none",
    maxWidth: "100%",
  },
  mainSection: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e4e4e7",
  },
  header: {
    backgroundColor: "#00629B", // IEEE blue
    color: "#ffffff",
    padding: "30px",
    textAlign: "center" as const,
    fontSize: "24px",
    fontWeight: "700",
    margin: "0",
  },
  content: {
    padding: "35px",
  },
  greeting: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#18181b",
    margin: "0 0 15px",
    lineHeight: "1.5",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#3f3f46",
    margin: "0 0 20px",
  },
  paragraphSmall: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#52525b",
    margin: "0 0 10px",
  },
  button: {
    backgroundColor: "#00629B", // IEEE blue
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    margin: "25px auto",
  },
  expiry: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#71717a",
    margin: "20px 0",
    textAlign: "center" as const,
  },
  link: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#00629B", // IEEE blue
    margin: "0 0 25px",
    wordBreak: "break-all" as const,
  },
  signature: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#52525b",
    margin: "30px 0 0",
  },
  divider: {
    margin: "0",
    borderTop: "1px solid #e4e4e7",
  },
  footer: {
    padding: "20px 0",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#71717a",
    margin: "5px 0",
  },
};
