import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockUsers, mockMemberships } from "@/lib/mock-data";

export default function AdminUsers() {
  return (
    <div className="px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage platform users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{mockUsers.length} registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Communities
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => {
                  const membershipCount = mockMemberships.filter(
                    (m) => m.userId === user._id,
                  ).length;

                  return (
                    <tr key={user._id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {user.phone ?? "—"}
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="text-[11px]">
                          {membershipCount}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
