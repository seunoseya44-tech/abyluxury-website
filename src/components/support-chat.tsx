"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Message = {
  id: number;
  sender: "user" | "admin";
  body: string;
  created_at: string;
};

export function SupportChat() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [booted, setBooted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastId = messages.length ? messages[messages.length - 1].id : 0;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  // Load the thread when the panel first opens (only for signed-in users).
  useEffect(() => {
    if (!open || booted || !user) return;
    api
      .get<{ messages: Message[] }>("v1/support/thread")
      .then((r) => {
        setMessages(r.messages);
        setBooted(true);
        scrollToBottom();
      })
      .catch(() => setBooted(true));
  }, [open, booted, user, scrollToBottom]);

  // Poll for new (admin) messages while the panel is open.
  useEffect(() => {
    if (!open || !booted || !user) return;
    const t = setInterval(async () => {
      try {
        const r = await api.get<{ messages: Message[] }>("v1/support/poll", { after: lastId });
        if (r.messages.length) {
          setMessages((prev) => [...prev, ...r.messages]);
          scrollToBottom();
        }
      } catch {
        // ignore transient errors
      }
    }, 5000);
    return () => clearInterval(t);
  }, [open, booted, user, lastId, scrollToBottom]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    setSending(true);
    setInput("");
    try {
      const r = await api.post<{ message: Message }>("v1/support/messages", { body });
      setMessages((prev) => [...prev, r.message]);
      scrollToBottom();
    } catch {
      setInput(body); // restore on failure
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Trigger — labeled "Chat with us" pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-[var(--color-sylarm-red)] text-white font-semibold text-sm shadow-[0_10px_30px_-8px_rgba(232,58,74,0.7)] hover:bg-[var(--color-sylarm-red-light)] transition"
      >
        {open ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Close
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-8.5 8.5 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 018.5-8.5 8.38 8.38 0 018.5 8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Chat with us
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,520px)] flex flex-col rounded-2xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border-strong)] shadow-2xl">
          <div className="px-4 py-3 bg-[var(--color-sylarm-red)] text-white">
            <p className="font-display font-bold">Aby Luxury Support</p>
            <p className="text-xs text-white/80">We typically reply within a few minutes</p>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)]">
              <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
            </div>
          ) : !user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[var(--color-bg)]">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-[var(--color-text)] font-semibold">Sign in to chat with us</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Log in or create an account to start a conversation with our team.
              </p>
              <div className="mt-5 flex gap-2">
                <Link
                  href="/login"
                  className="px-4 h-10 inline-flex items-center rounded-xl bg-[var(--color-sylarm-red)] text-white text-sm font-semibold"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 h-10 inline-flex items-center rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text)] text-sm font-semibold"
                >
                  Create account
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg)]">
                {!booted ? (
                  <p className="text-center text-sm text-[var(--color-text-muted)]">Loading…</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                    👋 Hi {user.name.split(" ")[0]}! Ask us anything about rentals, sales or your bookings.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                        m.sender === "user"
                          ? "ml-auto bg-[var(--color-sylarm-red)] text-white rounded-br-sm"
                          : "mr-auto bg-[var(--color-card-2)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-sm"
                      }`}
                    >
                      {m.body}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={send} className="p-3 border-t border-[var(--color-border)] flex gap-2 bg-[var(--color-card)]">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-10 px-3 rounded-xl bg-[var(--color-bg-3)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-sylarm-red)]"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="h-10 px-4 rounded-xl bg-[var(--color-sylarm-red)] text-white text-sm font-semibold disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
