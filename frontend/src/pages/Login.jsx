import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CheckSquare2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted focus:border-accent";

const Login = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setIsSaving(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Please check your details and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main className="grid h-screen place-items-center bg-page px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-9">
        <Link
          to="/login"
          className="mb-8 flex items-center gap-2 font-heading text-lg font-extrabold"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
            <CheckSquare2 size={19} />
          </span>
          DayBook
        </Link>
        <p className="text-sm font-semibold text-accent">
          A little more progress
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Pick up where you left off. Your next small step is waiting.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">
            Email address
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
            />
          </label>
          {/* {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )} */}
          <button
            disabled={isSaving}
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSaving ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          New to DayBook?{" "}
          <Link
            to="/register"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
