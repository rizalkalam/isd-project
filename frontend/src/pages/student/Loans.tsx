import { useQuery } from "@tanstack/react-query";
import { getMyLoans, LoanReadWithDetails } from "../../features/loans/api/loans";
import { Badge } from "../../components/ui/badge";

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning"> = {
  PENDING: "secondary",
  APPROVED: "default",
  ACTIVE: "default",
  REJECTED: "destructive",
  RETURNED: "outline",
};

const isOverdue = (loan: LoanReadWithDetails): boolean =>
  loan.status === "ACTIVE" && !!loan.due_date && new Date(loan.due_date) < new Date();

const StudentLoans = () => {
  const { data: loans, isLoading, error } = useQuery({
    queryKey: ["my-loans"],
    queryFn: getMyLoans,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">My Loans</h1>
          <p className="text-sm text-slate-500">Track your current and past borrow requests.</p>
        </header>
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg" />
          ))}
        </div>
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">My Loans</h1>
        <p className="text-sm text-slate-500">Track your current and past borrow requests.</p>
      </header>

      {!loans || loans.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
          <p className="text-slate-500">You have no loan history yet.</p>
          <a href="/student/discovery" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            Browse the catalog to request a book
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan: LoanReadWithDetails) => {
            const overdue = isOverdue(loan);
            return (
              <div
                key={loan.id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  overdue ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100"
                }`}
              >
                <div>
                  <p className="font-medium text-slate-900">{loan.book_title}</p>
                  <p className="text-xs text-slate-500">{loan.book_author}</p>
                </div>
                <Badge variant={overdue ? "warning" : STATUS_BADGE_VARIANT[loan.status]}>
                  {overdue ? "OVERDUE" : loan.status}
                </Badge>
                <p className="text-sm text-slate-600">
                  {loan.due_date ? `Due: ${new Date(loan.due_date).toLocaleDateString()}` : "—"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentLoans;
