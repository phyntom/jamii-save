"use client";
import { useEffect } from "react";
import { Logo } from "../commons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

export function InvitationCard({
    title,
    token,
    description,
    children
}: {
    title: string;
    token?: string;
    description: React.ReactNode;
    children?: React.ReactNode;
}) {

    useEffect(() => {
        if (token) {
            sessionStorage.setItem("invitation_token", token);
        }
    }, [token]);
    return (
        <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
            <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                    <Logo size="lg" />
                </div>
                <div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent />
            {children}
        </Card>
    );
}