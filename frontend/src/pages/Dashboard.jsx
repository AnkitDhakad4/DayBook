import { useEffect } from "react";
import { Activity, CheckCircle2, Clock3, ListTodo, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthStore } from "../store/useAuthStore.js";
import { useStatsStore } from "../store/useStatsStore.js";
import { useTaskStore } from "../store/useTaskStore.js";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const stats = useStatsStore((state) => state.stats);
  const isLoading = useStatsStore((state) => state.isLoading);
  const fetchStats = useStatsStore((state) => state.fetchStats);
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks]);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const weekly = (stats?.weekly || []).map((item) => ({
    ...item,
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    }),
  }));
  const dueSoon = (stats?.dueSoon || []).map((item) => ({
    ...item,
    ...taskById.get(item.id),
  }));
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Your personal space</p>
          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-2 text-sm text-muted">
            A small step forward is still progress.
          </p>
        </div>
        <Link
          to="/tasks"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={17} />
          New task
        </Link>
      </div>
      {isLoading && !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total tasks"
            value={stats?.total || 0}
            icon={ListTodo}
          />
          <StatCard
            label="In progress"
            value={stats?.inProgress || 0}
            icon={Activity}
            tone="amber"
          />
          <StatCard
            label="Completed"
            value={stats?.done || 0}
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            label="Overdue"
            value={stats?.overdue || 0}
            hint="Tasks past their due date"
            icon={Clock3}
            tone="red"
          />
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-base font-bold">Your week</h2>
              <p className="mt-1 text-sm text-muted">
                Completed tasks, one day at a time
              </p>
            </div>
            <span className="rounded-lg bg-accent-soft p-2 text-accent">
              <Activity size={17} />
            </span>
          </div>
          <div className="mt-6 h-64">
            {weekly.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weekly}
                  margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="doneFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--accent)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--accent)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--ink)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completedCount"
                    name="Completed"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    fill="url(#doneFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">
                Your weekly progress will show here.
              </div>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-base font-bold">Due soon</h2>
              <p className="mt-1 text-sm text-muted">
                A few things on the horizon
              </p>
            </div>
            <span className="rounded-lg bg-warning-soft p-2 text-warning">
              <Clock3 size={17} />
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {dueSoon.length ? (
              dueSoon.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition hover:bg-surface-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {task.title || "Your upcoming task"}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      Due{" "}
                      {task.due_date
                        ? new Date(
                            `${task.due_date}T00:00:00`,
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : "soon"}
                    </span>
                  </span>
                  <span className="size-2 shrink-0 rounded-full bg-accent" />
                </Link>
              ))
            ) : (
              <EmptyState
                title="You're all caught up"
                description="No upcoming tasks for now. Enjoy the breathing room."
                action={
                  <Link
                    to="/tasks"
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    See all tasks
                  </Link>
                }
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
