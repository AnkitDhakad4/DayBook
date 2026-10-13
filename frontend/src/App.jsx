import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, Link } from "react-router-dom";
import { CheckSquare2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.js";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Board from "./pages/Board.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";
import Settings from "./pages/Settings.jsx";

const CenterLoader = () => (
  <div className="grid min-h-screen place-items-center bg-page">
    <div className="flex items-center gap-3 text-sm font-medium text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      Getting your space ready…
    </div>
  </div>
);
const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-page px-5 text-center">
    <div>
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
        <CheckSquare2 size={22} />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-bold">
        This page wandered off
      </h1>
      <p className="mt-2 text-sm text-muted">
        The page you are looking for is not here.
      </p>
      <Link
        to="/dashboard"
        className="mt-5 inline-block font-semibold text-accent hover:underline"
      >
        Back to your dashboard
      </Link>
    </div>
  </main>
);

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isLoading) return <CenterLoader />;
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "12px",
            background: "var(--surface)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/board" element={<Board />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
