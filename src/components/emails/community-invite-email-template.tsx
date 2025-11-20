import * as React from "react";
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Img,
} from "@react-email/components";

interface CommunityInvitationEmailProps {
    email: string;
    invitedByUsername: string;
    invitedByEmail: string;
    communityName: string;
    inviteLink: string;
}

const CommunityInviteEmailTemplate = (
    props: CommunityInvitationEmailProps
) => {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>You've been invited to join {props.communityName}</Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
                        {/* Company Logo */}
                        <Section className="text-center mb-[32px]">
                            <Img
                                src={"https://cdn.jsdelivr.net/gh/phyntom/jamii-save/public/jamii-save.png"}
                                width="52"
                                height="52"
                                alt="Jamii Save Logo"
                                style={{ display: 'block', margin: '0 auto' }}
                            />
                        </Section>

                        {/* Main Content */}
                        <Section>
                            <Heading className="text-[28px] font-bold text-gray-900 mb-[24px] text-center">
                                Join {props.communityName}
                            </Heading>

                            <Text className="text-[16px] text-gray-700 mb-[20px] leading-[24px]">
                                Hi {props.email},
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                                <strong>{props.invitedByUsername}</strong> has invited you to join <strong>{props.communityName}</strong> - a community where professionals connect, share insights, and grow together.
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[32px] leading-[24px]">
                                Get access to exclusive discussions, networking opportunities, and industry expertise from day one.
                            </Text>

                            {/* CTA Button */}
                            <Section className="text-center mb-[24px]">
                                <Button
                                    href={props.inviteLink}
                                    className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                                >
                                    Accept Invitation
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 text-center mb-[32px] leading-[20px]">
                                Can't click the button? <Link href={props.inviteLink} className="text-blue-600 underline">Use this link instead</Link>
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px]">
                                Looking forward to seeing you in the community!<br />
                                The {props.communityName} Team
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="border-t border-gray-200 pt-[24px] mt-[40px]">
                            <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                                Invited by {props.invitedByUsername} ({props.invitedByEmail})
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center m-0">
                                <Link href="#" className="text-gray-500 underline">Unsubscribe</Link> |
                                © 2025 {props.communityName}. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default CommunityInviteEmailTemplate;