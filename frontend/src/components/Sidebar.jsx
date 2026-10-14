import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare2, LayoutDashboard, ListTodo, Settings, Trello, FolderKanban } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { to: '/dashboard', label: 'Home', desktopLabel: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', desktopLabel: 'Tasks', icon: ListTodo },
  { to: '/projects', label: 'Projects', desktopLabel: 'Projects', icon: FolderKanban },
  { to: '/board', label: 'Board', desktopLabel: 'Board', icon: Trello },
  { to: '/settings', label: 'Settings', desktopLabel: 'Settings', icon: Settings }
];

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const initials = (user?.name || 'DayBook').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-heading font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-white"><CheckSquare2 size={19} /></span>
          DayBook
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => navigate('/settings')} aria-label="Open settings" className="grid size-9 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {initials}
          </button>
        </div>
      </header>

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface px-5 py-7 lg:flex">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 font-heading text-lg font-extrabold">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-white"><CheckSquare2 size={19} /></span>
          DayBook
        </Link>
        <nav className="mt-10 space-y-1">
          {links.map(({ to, desktopLabel, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink'}`}>
              <Icon size={18} />{desktopLabel}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
          <ThemeToggle label />
          <button onClick={() => navigate('/settings')} className="mt-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-surface-muted">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">{initials}</span>
            <span className="min-w-0"><span className="block truncate text-sm font-semibold">{user?.name || 'Your account'}</span><span className="block truncate text-xs text-muted">{user?.email || ''}</span></span>
          </button>
        </div>
      </aside>

      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface px-1 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-4px_16px_rgba(20,35,30,0.06)] lg:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition ${isActive ? 'text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink'}`}>
            {({ isActive }) => <><span className={`grid size-7 place-items-center rounded-xl ${isActive ? 'bg-accent-soft' : ''}`}><Icon size={18} /></span><span>{label}</span></>}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
