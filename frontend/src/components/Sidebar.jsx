import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare2, LayoutDashboard, ListTodo, Menu, Settings, Trello, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { to:'/dashboard', label:'Dashboard', icon:LayoutDashboard },
  { to:'/tasks', label:'Tasks', icon:ListTodo },
  { to:'/board', label:'Board', icon:Trello },
  { to:'/settings', label:'Settings', icon:Settings }
];

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const initials = (user?.name || 'Taskly').split(' ').map((part) => part[0]).slice(0,2).join('').toUpperCase();
  return <>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
      <div className="flex items-center gap-2 font-heading font-bold"><span className="grid size-8 place-items-center rounded-lg bg-accent text-white"><CheckSquare2 size={17} /></span>Taskly</div>
      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="rounded-lg p-2 hover:bg-surface-muted">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button>
    </header>
    <aside className={`${menuOpen?'block':'hidden'} fixed inset-x-0 top-16 z-30 max-h-[calc(100vh-4rem)] border-b border-border bg-surface px-4 py-4 lg:static lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-7`}>
      <div className="hidden items-center gap-2 px-2 font-heading text-lg font-extrabold lg:flex"><span className="grid size-9 place-items-center rounded-xl bg-accent text-white"><CheckSquare2 size={19} /></span>Taskly</div>
      <nav className="mt-1 space-y-1 lg:mt-10">{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} onClick={()=>setMenuOpen(false)} className={({isActive})=>`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${isActive?'bg-accent-soft text-accent':'text-muted hover:bg-surface-muted hover:text-ink'}`}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="mt-5 border-t border-border pt-4 lg:absolute lg:bottom-5 lg:left-5 lg:right-5">
        <ThemeToggle label />
        <button onClick={()=>navigate('/settings')} className="mt-3 flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-muted"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">{initials}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{user?.name || 'Your account'}</span><span className="block truncate text-xs text-muted">{user?.email || ''}</span></span></button>
      </div>
    </aside>
  </>;
};

export default Sidebar;
