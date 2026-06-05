"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, LoaderCircle, Mail, Send, X } from "lucide-react";

const INBOX = "kwame@owusuboakye.com";
type ContactContextValue = {
  showContact: (topic: string, trigger: HTMLButtonElement) => void;
};
const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactTrigger({
  children,
  className,
  topic = "",
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  topic?: string;
  "aria-label"?: string;
}) {
  const context = useContext(ContactContext);
  if (!context) throw new Error("ContactTrigger requires ContactProvider");
  return (
    <button
      type="button"
      className={`contact-trigger ${className ?? ""}`}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      onClick={(event) => context.showContact(topic, event.currentTarget)}
    >
      {children}
    </button>
  );
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const trigger = useRef<HTMLButtonElement | null>(null);
  const pending = useRef(false);
  const submission = useRef<{ body: string; id: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setAvailable(null);
    fetch("/api/contact", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Status unavailable");
        const result = await response.json();
        if (!controller.signal.aborted) setAvailable(result.available === true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, [open]);

  function showContact(nextTopic: string, nextTrigger: HTMLButtonElement) {
    trigger.current = nextTrigger;
    setTopic(nextTopic);
    setError("");
    setStatus("idle");
    setOpen(true);
  }
  function changeOpen(nextOpen: boolean) {
    if (pending.current) return;
    if (!nextOpen && status === "sent") {
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      submission.current = null;
    }
    setOpen(nextOpen);
  }
  function emailUrl() {
    const subject = topic
      ? `Let’s talk about ${topic}`
      : "Hello from your portfolio";
    const text = [
      message.trim(),
      name.trim() ? `From: ${name.trim()}` : "",
      email.trim() ? `Reply email: ${email.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || available === null) return;
    if (!available) {
      window.location.assign(emailUrl());
      return;
    }
    pending.current = true;
    setStatus("sending");
    setError("");
    const fields = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      topic,
      website,
    };
    const body = JSON.stringify(fields);
    if (submission.current?.body !== body)
      submission.current = { body, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          submissionId: submission.current.id,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (result.code === "delivery_unavailable") setAvailable(false);
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Your message could not be sent. Please try again.",
        );
      }
      setStatus("sent");
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error &&
          caught.name !== "TimeoutError" &&
          !(caught instanceof TypeError) &&
          !(caught instanceof SyntaxError)
          ? caught.message
          : "We couldn’t confirm delivery. Please retry or open your email app.",
      );
    } finally {
      pending.current = false;
    }
  }

  return (
    <ContactContext.Provider value={{ showContact }}>
      {children}
      <Dialog.Root open={open} onOpenChange={changeOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="contact-modal-overlay" />
          <Dialog.Content
            className="contact-modal"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (trigger.current?.isConnected) trigger.current.focus();
            }}
            onEscapeKeyDown={(event) => {
              if (pending.current) event.preventDefault();
            }}
            onPointerDownOutside={(event) => {
              if (pending.current) event.preventDefault();
            }}
          >
            <Dialog.Close
              className="contact-modal-close"
              aria-label="Close contact form"
              disabled={status === "sending"}
            >
              <X size={19} />
            </Dialog.Close>
            <div className="contact-modal-mark">
              <Mail size={22} strokeWidth={1.5} />
            </div>
            <span className="section-kicker">LET’S MAKE A CONNECTION</span>
            <Dialog.Title className="contact-modal-title">
              {status === "sent" ? "Message sent." : "A good place to start."}
            </Dialog.Title>
            <Dialog.Description className="contact-modal-description">
              {status === "sent"
                ? "Thanks for reaching out. Your message is on its way to my inbox."
                : "A project, a question, or just a hello. I’d love to hear from you."}
            </Dialog.Description>
            {status === "sent" ? (
              <div className="contact-success" role="status">
                <div>
                  <Check size={25} />
                </div>
                <p>
                  I’ll reply to <strong>{email}</strong>.
                </p>
                <Dialog.Close className="button button-primary">
                  Back to exploring <ArrowUpRight size={15} />
                </Dialog.Close>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={submit}
                aria-busy={status === "sending"}
              >
                {topic && (
                  <p className="contact-topic">
                    Regarding <strong>{topic}</strong>
                  </p>
                )}
                {available === false && (
                  <p className="contact-availability" role="status">
                    Direct sending isn’t available right now. Compose your note
                    below, then open it in your email app.
                  </p>
                )}
                <div className="contact-field-row">
                  <label htmlFor="contact-name">
                    Your name
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      minLength={2}
                      maxLength={100}
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={status === "sending"}
                    />
                  </label>
                  <label htmlFor="contact-email">
                    Your email
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      maxLength={254}
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={status === "sending"}
                    />
                  </label>
                </div>
                <label htmlFor="contact-message">
                  What’s on your mind?
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me a little about it…"
                    rows={5}
                    minLength={10}
                    maxLength={5000}
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    disabled={status === "sending"}
                  />
                </label>
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">
                    Website
                    <input
                      id="contact-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </label>
                </div>
                {error && (
                  <p className="contact-form-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  className="button button-primary contact-submit"
                  type="submit"
                  disabled={status === "sending" || available === null}
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle size={16} className="contact-spinner" />{" "}
                      Sending…
                    </>
                  ) : available === null ? (
                    "Just a moment…"
                  ) : available ? (
                    <>
                      Send message <Send size={15} />
                    </>
                  ) : (
                    <>
                      Open email app <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
                <div className="contact-form-footer">
                  <span>Your email lets me reply to you directly.</span>
                  <a
                    href={status === "sending" ? undefined : emailUrl()}
                    aria-disabled={status === "sending"}
                  >
                    Email me directly <ArrowUpRight size={12} />
                  </a>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ContactContext.Provider>
  );
}
