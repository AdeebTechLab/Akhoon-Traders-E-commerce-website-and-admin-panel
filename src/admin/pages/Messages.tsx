import { Mail, MailOpen, MessageCircle, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useStore } from '../../context/StoreContext';
import type { ContactMessage } from '../../types';
import { formatDateTime, whatsappLink } from '../../utils/format';
import { PageHeader } from '../components/ui';

export function AdminMessages() {
  const { messages, setMessageRead, deleteMessage } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${messages.length} messages · ${unread} unread`} />

      {messages.length === 0 ? (
        <div className="card p-12 text-center text-stone-500">No messages yet.</div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id} className={`card overflow-hidden ${!m.read ? 'border-l-4 border-l-gold-400' : ''}`}>
                <button
                  className="flex w-full items-start gap-4 p-4 text-left hover:bg-stone-50"
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!m.read) setMessageRead(m.id, true);
                  }}
                >
                  <span className={`mt-0.5 ${m.read ? 'text-stone-400' : 'text-gold-600'}`}>
                    {m.read ? <MailOpen className="size-5" /> : <Mail className="size-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className={`${m.read ? 'font-medium' : 'font-bold'} text-stone-900`}>{m.subject}</span>
                      <span className="text-xs text-stone-400">{formatDateTime(m.createdAt)}</span>
                    </span>
                    <span className="block text-sm text-stone-500">
                      {m.name} · {m.phone}
                    </span>
                    {!open && <span className="mt-1 block truncate text-sm text-stone-600">{m.message}</span>}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-4 sm:pl-13">
                    <p className="text-sm whitespace-pre-line text-stone-700">{m.message}</p>
                    {m.email && <p className="mt-2 text-xs text-stone-500">Email: {m.email}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={whatsappLink(m.phone.replace(/\D/g, '').replace(/^0/, '92'), `Assalamu Alaikum ${m.name}, regarding your message: "${m.subject}"`)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-whatsapp btn-sm"
                      >
                        <MessageCircle className="size-4" /> Reply on WhatsApp
                      </a>
                      <a href={`tel:${m.phone.replace(/\D/g, '')}`} className="btn btn-outline btn-sm">
                        <Phone className="size-4" /> Call
                      </a>
                      <button onClick={() => setMessageRead(m.id, false)} className="btn btn-ghost btn-sm">
                        Mark unread
                      </button>
                      <button onClick={() => setToDelete(m)} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="size-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete message?"
        message={`The message from ${toDelete?.name} will be deleted.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteMessage(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
