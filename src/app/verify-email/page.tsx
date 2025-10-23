import VerifyEmail from "@/components/emails/verify-email"

export default function VerifyEmailPage({ searchParams }: { searchParams: { email: string } }) {
    const email = searchParams.email as string
    return <VerifyEmail email={email} />
}