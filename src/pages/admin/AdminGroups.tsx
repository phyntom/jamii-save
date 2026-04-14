import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCommunities } from "@/lib/mock-data";

export default function AdminGroups() {
  return (
    <div className="px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Groups</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage communities on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Communities</CardTitle>
          <CardDescription>
            {mockCommunities.length} registered communities
          </CardDescription>
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
                    Country
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Members
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Target
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Frequency
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockCommunities.map((c) => (
                  <tr key={c._id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {c.country ?? "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {c.memberCount}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {c.currency} {c.targetAmount.toLocaleString()}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {c.contributionFrequency}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={c.isActive ? "default" : "secondary"}
                        className="text-[11px]"
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
