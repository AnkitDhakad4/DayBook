import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between"><h2 id="modal-title" className="font-heading text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-muted hover:bg-surface-muted"><X size={18} /></button></div>
      {children}
    </section>
  </div>;
};

export default Modal;
