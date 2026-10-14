import { LogOut, Moon, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import ThemeToggle from '../components/ThemeToggle.jsx';

const Settings = () => {
  const user=useAuthStore((state)=>state.user);const logout=useAuthStore((state)=>state.logout);const navigate=useNavigate();
  const signOut=async()=>{await logout();navigate('/login',{replace:true});};
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-sm font-medium text-accent">Make it yours</p><h1 className="mt-2 font-heading text-2xl font-bold">Settings</h1><p className="mt-2 text-sm text-muted">A few details about your DayBook space.</p></div>
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-lg bg-accent-soft p-2.5 text-accent"><UserRound size={19}/></span><div><h2 className="font-heading font-bold">Your account</h2><p className="mt-0.5 text-sm text-muted">The name and email on your account</p></div></div><div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Name</p><p className="mt-2 text-sm font-medium">{user?.name||'—'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p><p className="mt-2 break-all text-sm font-medium">{user?.email||'—'}</p></div></div></section>
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-lg bg-warning-soft p-2.5 text-warning"><Moon size={19}/></span><div><h2 className="font-heading font-bold">Appearance</h2><p className="mt-0.5 text-sm text-muted">Choose a comfortable theme</p></div></div><ThemeToggle label/></section>
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-7"><div><h2 className="font-heading font-bold">Sign out</h2><p className="mt-1 text-sm text-muted">You can pick up right where you left off next time.</p></div><button onClick={signOut} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-danger transition hover:bg-danger-soft"><LogOut size={16}/>Log out</button></section>
  </div>;
};

export default Settings;
