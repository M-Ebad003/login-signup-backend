import {
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import Link from "next/link";

import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp?: string;
}

export default function ResetPasswordEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your password Recovery email</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            <Link href="/newPassword">Reset Password here</Link>
          </Text>
        </Row>
        <Row>
          <Text></Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code,please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
