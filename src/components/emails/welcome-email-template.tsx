import * as React from "react";
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
    Img,
    Preview,
    Heading,
    Link
} from "@react-email/components";

interface WelcomeEmailTemplateProps {
    name: string;
}


const WelcomeEmailTemplate = (props: WelcomeEmailTemplateProps) => {
    const { name } = props;
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>Email Verification</Preview>
                <Container style={container}>
                    <Section style={coverSection}>
                        <Section style={imageSection}>
                            <Img
                                src={"https://cdn.jsdelivr.net/gh/phyntom/jamii-save/public/jamii-save.png"}
                                width="52"
                                height="52"
                                alt="Jamii Save Logo"
                                style={{ display: 'block', margin: '0 auto' }}
                            />
                        </Section>
                        <Section style={upperSection}>
                            <Heading style={h1}>Welcome to Jamii Save</Heading>
                            <Text style={mainText}>
                                Thanks {name}, for creating an account on Jamii Save. We are excited to have you on board.
                            </Text>
                            <Text style={mainText}>
                                You can start using Jamii Save by logging in with your email and password.
                            </Text>
                            <Text style={mainText}>
                                If you have any questions, please contact us at <a href="mailto:support@jamiihub.com" style={link}>support@jamiihub.com</a>.
                            </Text>
                        </Section>
                        <Hr />
                        <Section style={lowerSection}>
                            <Text style={cautionText}>
                                Jamii Save will never email you and ask you to disclose
                                or verify your password, credit card, or banking account number.
                            </Text>
                        </Section>
                    </Section>
                    <Text style={footerText}>
                        This message was produced and distributed by Amazon Web Services,
                        Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
                        Services, Inc.. All rights reserved. AWS is a registered trademark
                        of{' '}
                        <Link href="https://jamiihub.com" target="_blank" style={link}>
                            Jamii Hub
                        </Link>
                        , Inc. View our{' '}
                        <Link href="https://jamiihub.com" target="_blank" style={link}>
                            privacy policy
                        </Link>
                        .
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
export default WelcomeEmailTemplate;

const main = {
    backgroundColor: '#fff',
    color: '#212121',
};

const container = {
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#eee',
};

const h1 = {
    color: '#333',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
};

const link = {
    color: '#2754C5',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    textDecoration: 'underline',
};

const text = {
    color: '#333',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
};

const button = {
    ...text,
    display: 'block',
    width: "50%",
    backgroundColor: '#1E7A5E',
    color: '#fff',
    borderRadius: '4px',
    padding: '10px 20px',
    textAlign: 'center' as const,
    margin: '24px auto',
    cursor: 'pointer',
};

const imageSection = {
    backgroundColor: '#eef2ff',
    padding: '20px 0',
    textAlign: 'center' as const,
};
const coverSection = { backgroundColor: '#fff' };

const upperSection = { padding: '25px 35px' };

const lowerSection = { padding: '25px 35px' };

const footerText = {
    ...text,
    fontSize: '12px',
    padding: '0 20px',
};

const verifyText = {
    ...text,
    margin: 0,
    fontWeight: 'bold',
    textAlign: 'center' as const,
};

const verifyButton = {
    ...button,
    borderRadius: '4px',
    padding: '10px 20px',
    textAlign: 'center' as const,
};

const codeText = {
    ...text,
    fontWeight: 'bold',
    fontSize: '36px',
    margin: '10px 0',
    textAlign: 'center' as const,
};

const validityText = {
    ...text,
    margin: '0px',
    textAlign: 'center' as const,
};

const mainText = { ...text, marginBottom: '14px' };

const cautionText = { ...text, margin: '0px' };