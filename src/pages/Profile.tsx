import {
  CreditCard,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mockCurrentUser,
  mockMemberships,
  mockCommunities,
  mockSubscription,
} from "@/lib/mock-data";
import { format } from "date-fns";

export default function Profile() {
  const userCommunities = mockCommunities.filter((c) =>
    mockMemberships.some(
      (m) => m.communityId === c._id && m.userId === mockCurrentUser._id,
    ),
  );

  const userRoles = mockMemberships
    .filter((m) => m.userId === mockCurrentUser._id)
    .map((m) => {
      const community = mockCommunities.find((c) => c._id === m.communityId);
      return { community: community?.name ?? "—", role: m.role };
    });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal information and subscription
        </p>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            icon={<User className="h-4 w-4" />}
            label="Full Name"
            value={mockCurrentUser.name}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={mockCurrentUser.email}
          />
          <InfoRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={mockCurrentUser.phone ?? "Not provided"}
          />
        </CardContent>
      </Card>

      {/* Community Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Community Memberships</CardTitle>
          <CardDescription>
            {userCommunities.length} communit{userCommunities.length === 1 ? "y" : "ies"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You haven't joined any communities yet.
            </p>
          ) : (
            <div className="space-y-3">
              {userRoles.map((ur) => (
                <div
                  key={ur.community}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{ur.community}</span>
                  </div>
                  <Badge variant="secondary" className="capitalize text-[11px]">
                    {ur.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{mockSubscription.plan} Plan</p>
                <p className="text-xs text-muted-foreground">
                  {mockSubscription.billingCycle} · {mockSubscription.currency}{" "}
                  {mockSubscription.price}/{mockSubscription.billingCycle === "Monthly" ? "mo" : "yr"}
                </p>
              </div>
            </div>
            <Badge
              variant={
                mockSubscription.status === "active" ? "default" : "destructive"
              }
              className="capitalize text-[11px]"
            >
              {mockSubscription.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Renews on {format(mockSubscription.renewsAt, "MMM d, yyyy")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
