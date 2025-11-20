"use client";

// import { removeMember } from "@/server/members";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MembersTableAction({ memberId }: { memberId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRemoveMember = async () => {
        try {
            setIsLoading(true);
            // const { success, error } = await removeMember(memberId);

            // if (!success) {
            //     toast.error(error || "Failed to remove member");
            //     return;
            // }

            setIsLoading(false);
            toast.success("Member removed from organization");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove member from organization");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleRemoveMember}
            size="sm"
            disabled={isLoading}
            className="bg-primary/10 text-primary hover:bg-primary/20 focus:ring-2 focus:ring-primary/30"
        >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
        </Button>
    );
}