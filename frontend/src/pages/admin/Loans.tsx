import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoans, updateLoanStatus, LoanReadWithDetails, LoanRead } from "../../features/loans/api/loans";
import { Badge } from "../../components/ui/badge";

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

const STATUS_BADGE_VARIANT: Record<LoanRead["status"], "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  ACTIVE: "default",
  REJECTED: "destructive",
  RETURNED: "outline",
};

const Loans = () => {
  const queryClient = useQueryClient();

  const { data: loans, isLoading, error } = useQuery({
    queryKey: ["loans"],
    queryFn: getLoans,
  });

  const statusMutation = useMutation({
    mutationFn: ({ loanId, status }: { loanId: number; status: LoanRead["status"] }) =>
      updateLoanStatus(loanId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loans"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (loanId: number) => updateLoanStatus(loanId, "REJECTED"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loans"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading loans: {(error as any).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Loan Management</h1>
        <p className="text-slate-500">Review and process student borrow requests.</p>
      </header>

      {!loans || loans.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
          <p className="text-slate-500">No loans yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Book</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Student</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Requested</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loans.map((loan: LoanReadWithDetails) => {
                const nextStatus = STATUS_TRANSITIONS[loan.status];
                const nextLabel = STATUS_LABELS[loan.status];
                const isPending = statusMutation.isPending && (statusMutation.variables as any)?.loanId === loan.id;

                return (
                  <tr key={loan.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{loan.book_title}</p>
                      <p className="text-slate-500 text-xs">{loan.book_author}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{loan.student_email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE_VARIANT[loan.status]}>
                        {loan.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(loan.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default Loans;
