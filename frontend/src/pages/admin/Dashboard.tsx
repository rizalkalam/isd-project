import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoans, getDashboardStats, updateLoanStatus, LoanReadWithDetails, LoanRead } from "../../features/loans/api/loans";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { BookOpen, Clock, AlertTriangle, Library } from "lucide-react";

const STATUS_TRANSITIONS: Record<LoanRead["status"], LoanRead["status"] | null> = {
  PENDING: "APPROVED",
  APPROVED: "ACTIVE",
  ACTIVE: "RETURNED",
  REJECTED: null,
  RETURNED: null,
};

const STATUS_LABELS: Record<LoanRead["status"], string> = {
  PENDING: "Approve",
  APPROVED: "Mark Active",
  ACTIVE: "Mark Returned",
  REJECTED: "",
  RETURNED: "",
};

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning"> = {
  PENDING: "secondary",
  APPROVED: "default",
  ACTIVE: "default",
  REJECTED: "destructive",
  RETURNED: "outline",
  OVERDUE: "warning",
};

const isOverdue = (loan: LoanReadWithDetails): boolean =>
  loan.status === "ACTIVE" && !!loan.due_date && new Date(loan.due_date) < new Date();

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACTIVE" | "OVERDUE">("ALL");

  const { data: loans, isLoading, error } = useQuery({
    queryKey: ["loans"],
    queryFn: getLoans,
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const statusMutation = useMutation({
    mutationFn: ({ loanId, status }: { loanId: number; status: LoanRead["status"] }) =>
      updateLoanStatus(loanId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (loanId: number) => updateLoanStatus(loanId, "REJECTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" aria-label="Loading loans…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Could not load loans. Please refresh the page or contact support if the problem persists.
      </div>
    );
  }

  const filteredLoans = (loans ?? []).filter((loan) => {
    if (filter === "ALL") return true;
    if (filter === "OVERDUE") return isOverdue(loan);
    return loan.status === filter;
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Library Dashboard</h1>
        <p className="text-sm text-slate-500">Monitor loans, requests, and overdue items across the library.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Active Loans
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {stats?.active ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Requests
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {stats?.pending ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Overdue Items
            </CardDescription>
            <CardTitle className={stats?.overdue != null && stats.overdue > 0 ? "text-xl font-semibold text-amber-600" : "text-xl font-semibold text-slate-950"}>
              {stats?.overdue ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Library className="h-4 w-4" /> Total Loans
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {stats?.total ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section>
        <div className="flex gap-2 mb-4">
          {(["ALL", "PENDING", "ACTIVE", "OVERDUE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "bg-slate-900 text-white rounded-md px-3 py-1 text-sm font-medium"
                  : "border border-slate-200 text-slate-600 rounded-md px-3 py-1 text-sm font-medium hover:bg-slate-50"
              }
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {!loans || loans.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
            <p className="text-slate-500">No loans yet. Approved requests will appear here.</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
            <p className="text-slate-500">No {filter.charAt(0) + filter.slice(1).toLowerCase()} loans found.</p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Student</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Book Title</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Due Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan: LoanReadWithDetails) => {
                  const overdue = isOverdue(loan);
                  const nextStatus = STATUS_TRANSITIONS[loan.status];
                  const nextLabel = STATUS_LABELS[loan.status];
                  const isPending = statusMutation.isPending && (statusMutation.variables as any)?.loanId === loan.id;

                  return (
                    <tr
                      key={loan.id}
                      className={`border-b last:border-0 transition-colors ${
                        overdue
                          ? "bg-amber-50 border-l-4 border-amber-400 hover:bg-amber-100"
                          : "hover:bg-slate-50"
                      }`}
                      aria-label={overdue ? "This loan is overdue" : undefined}
                    >
                      <td className="px-4 py-3 text-slate-600">{loan.student_email}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{loan.book_title}</p>
                        <p className="text-slate-500 text-xs">{loan.book_author}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={overdue ? "warning" : STATUS_BADGE_VARIANT[loan.status]}>
                          {overdue ? "OVERDUE" : loan.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          {nextStatus && (
                            <button
                              onClick={() => statusMutation.mutate({ loanId: loan.id, status: nextStatus })}
                              disabled={isPending}
                              className="px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                              {isPending ? "Saving…" : nextLabel}
                            </button>
                          )}
                          {loan.status === "PENDING" && (
                            <button
                              onClick={() => rejectMutation.mutate(loan.id)}
                              disabled={rejectMutation.isPending && rejectMutation.variables === loan.id}
                              className="px-3 py-1 rounded-md border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
