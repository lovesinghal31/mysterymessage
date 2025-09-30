import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa5Bs.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your Mystery Message verification code: {otp}</Preview>

      <Section
        style={{
          width: "100%",
          background: "linear-gradient(135deg,#f5f7fa 0%,#eef1f5 100%)",
          padding: "48px 0",
          fontFamily: "Inter, Roboto, Verdana, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 8px 28px rgba(17,24,39,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Accent Bar */}
          <div
            style={{
              height: 4,
              width: "100%",
              background: "linear-gradient(90deg,#6366f1,#3b82f6,#06b6d4)",
            }}
          />
          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading
              as="h1"
              style={{
                color: "#111827",
                fontSize: "24px",
                fontWeight: 600,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
                textAlign: "center",
              }}
            >
              Verify your email
            </Heading>
            <Text
              style={{
                color: "#374151",
                fontSize: "15px",
                lineHeight: "1.6",
                margin: "0 0 24px",
                textAlign: "center",
              }}
            >
              Hi <strong style={{ color: "#111827" }}>{username}</strong>,
              <br />
              Use the one‑time code below to finish creating your account. This
              code expires in 1 hour.
            </Text>
            {/* Code Block */}
            <div
              style={{
                fontFamily:
                  'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                background: "#111827",
                color: "#fff",
                fontSize: "30px",
                letterSpacing: "8px",
                fontWeight: 700,
                padding: "18px 12px",
                borderRadius: "12px",
                textAlign: "center",
                margin: "0 0 28px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              {otp}
            </div>
            <Text
              style={{
                color: "#6b7280",
                fontSize: "13px",
                lineHeight: "1.5",
                margin: "0 0 24px",
                textAlign: "center",
              }}
            >
              Didn’t request this? You can safely ignore this email.
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Mystery Message. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}
