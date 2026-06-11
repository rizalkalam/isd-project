import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Inventory from './pages/admin/Inventory';
import Loans from './pages/admin/Loans';
import Dashboard from './pages/admin/Dashboard';
import Discovery from './pages/student/Discovery';
import StudentLoans from './pages/student/Loans';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/loans" element={<Loans />} />
          <Route path="/student/discovery" element={<Discovery />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/student/loans" element={<StudentLoans />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
