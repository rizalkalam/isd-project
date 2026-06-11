import api from '../../../api/client';

export interface LoanRead {
  id: number;
  copy_id: number;
  title_id: number;
  user_id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'RETURNED';
  created_at: string;
  updated_at: string;
  due_date: string | null;
}

export interface LoanReadWithDetails extends LoanRead {
  book_title: string;
  book_author: string;
  student_email: string;
}

export interface DashboardStats {
  active: number;
  pending: number;
  overdue: number;
  total: number;
}

export const requestLoan = async (titleId: number): Promise<LoanRead> => {
  const response = await api.post('/loans/request', { title_id: titleId });
  return response.data;
};

export const getLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/');
  return response.data;
};

export const updateLoanStatus = async (
  loanId: number,
  status: LoanRead['status'],
): Promise<LoanRead> => {
  const response = await api.put(`/loans/${loanId}/status`, { status });
  return response.data;
};

export const getOverdueLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/overdue');
  return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/loans/dashboard-stats');
  return response.data;
};

export const getMyLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/my');
  return response.data;
};
