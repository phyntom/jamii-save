import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAuditLogs } from "@/lib/mock-data";
import { format } from "date-fns";

export default function AdminAuditLogs() {
  const logs = [...mockAuditLogs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform-wide activity trail
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>{logs.length} recorded events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Performed By
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                      {format(log.timestamp, "MMM d, yyyy")}
                    </td>
                    <td className="py-3 font-medium">{log.action}</td>
                    <td className="py-3 text-muted-foreground">
                      {log.performedBy}
                    </td>
                    <td className="py-3 text-muted-foreground">{log.target}</td>
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
