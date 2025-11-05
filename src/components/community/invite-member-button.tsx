'use client';

import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { user } from '@/drizzle/schema';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';


interface InviteMemberButtonProps {
  communityId: string;
}

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export function InviteMemberButton({ communityId }: InviteMemberButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });
  async function handleInvite(data: z.infer<typeof inviteSchema>) {
    try {
      setIsLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: data.email,
        role: "member",
        organizationId: communityId,
      });
      console.error("error", error);
      if (error) {
        toast.error(error.message);
        return;
      }

      setIsLoading(false);
      toast.success("Invitation sent to member");
      router.refresh();
    } catch (error) {
      toast.error("Failed to invite member to organization");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Send an invitation to join this community via email</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleInvite)} className="space-y-4">
          <input type="hidden" name="communityId" value={communityId} />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                      <Input type="email" autoComplete="email webauthn" {...field} />
                    </FieldContent>
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )} />
            </FieldGroup>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
