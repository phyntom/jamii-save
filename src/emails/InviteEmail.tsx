import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InviteEmailProps {
  inviterName: string;
  communityName: string;
  inviteUrl: string;
}

export function InviteEmail({
  inviterName,
  communityName,
  inviteUrl,
}: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {inviterName} invited you to join {communityName} on Jamii Save
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Jamii Save</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>You've been invited</Heading>
            <Text style={paragraph}>
              <strong>{inviterName}</strong> has invited you to join{" "}
              <strong>{communityName}</strong> — a savings community on Jamii
              Save.
            </Text>
            <Text style={paragraph}>
              Jamii Save helps communities manage rotating savings, track
              contributions, and coordinate loans together.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteUrl}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={hint}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={link}>{inviteUrl}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              This invitation expires in 7 days. If you weren't expecting this
              email, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InviteEmail;

// ── Styles ────────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "40px auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#111827",
  padding: "20px 32px",
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h1: React.CSSProperties = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const buttonContainer: React.CSSProperties = {
  margin: "28px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#111827",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};

const hint: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 4px",
};

const link: React.CSSProperties = {
  color: "#2563eb",
  fontSize: "13px",
  wordBreak: "break-all",
  margin: "0 0 24px",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};
