"use client";

import React, { useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { profile } from "@/content/profile";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import DoubleCheckIcon from "@/icons/double-check-icon";
import DownloadIcon from "@/icons/download-icon";
import SendHorizontalIcon from "@/icons/send-horizontal-icon";

export function ContactView() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const [sendRef, sendHover] = useHoverIcon();
  const [doneRef, doneHover] = useHoverIcon();
  const [downloadRef, downloadHover] = useHoverIcon();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsUnavailable(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      company: formData.get("company") as string,
      startedAt,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 503) {
        const subject = encodeURIComponent(`Mensaje de ${data.name}`);
        const body = encodeURIComponent(data.message);
        setMailtoHref(`mailto:${profile.email}?subject=${subject}&body=${body}`);
        setIsUnavailable(true);
        return;
      }

      if (!response.ok) {
        setError(response.status === 429 ? t.contact.form.rateLimitError : t.contact.form.genericError);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError(t.contact.form.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setIsUnavailable(false);
    setError(null);
    formRef.current?.reset();
  };

  const details = [
    { label: t.contact.info.emailLabel, value: profile.email, href: `mailto:${profile.email}` },
    { label: t.contact.info.locationLabel, value: profile.location },
    { label: t.contact.info.responseLabel, value: t.contact.info.response },
  ];

  return (
    <>
      <div className="page-head">
        <div className="container-page">
          <h1 className="display-1">{t.contact.title}</h1>
          <p className="lead measure mt-5">{t.contact.intro}</p>
        </div>
      </div>

      <div className="container-page section grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
        <section className="surface p-7 md:p-9">
          {isSubmitted ? (
            <div {...doneHover}>
              <p className="flex items-center gap-2.5 text-lg font-semibold">
                <Icon className="text-[var(--accent)]">
                  <DoubleCheckIcon ref={doneRef} size={20} strokeWidth={1.75} />
                </Icon>
                {t.contact.form.success}
              </p>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                {t.contact.form.successDesc}
              </p>
              <button
                type="button"
                onClick={handleSendAnother}
                className="btn btn-secondary mt-6 h-10 min-h-0 text-sm"
              >
                {t.contact.form.sendAnother}
              </button>
            </div>
          ) : isUnavailable ? (
            <div>
              <p className="text-lg font-semibold">{t.contact.form.unavailableTitle}</p>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                {t.contact.form.unavailableDesc}
              </p>
              <a href={mailtoHref ?? `mailto:${profile.email}`} className="btn btn-primary mt-6 h-10 min-h-0 text-sm">
                {t.contact.form.unavailableCta}
              </a>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="field-label">
                  {t.contact.form.name}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={t.contact.form.namePlaceholder}
                  className="field"
                />
              </div>

              <div
                aria-hidden="true"
                style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
              >
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  {t.contact.form.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="message" className="field-label">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder={t.contact.form.messagePlaceholder}
                  className="field resize-y"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-[var(--destructive)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                {...sendHover}
                className="btn btn-primary disabled:opacity-60"
              >
                {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
                <Icon>
                  <SendHorizontalIcon ref={sendRef} size={17} strokeWidth={1.75} />
                </Icon>
              </button>
            </form>
          )}
        </section>

        <section className="lg:pt-2">
          <dl className="border-t border-[var(--line)]">
            {details.map((item) => (
              <div key={item.label} className="border-b border-[var(--line)] py-4">
                <dt className="data">{item.label}</dt>
                <dd className="mt-1.5 text-[0.9375rem]">
                  {item.href ? (
                    <a href={item.href} className="link break-all">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h2 className="text-sm font-semibold">{t.contact.info.cvLabel}</h2>
            <a
              href={profile.cv}
              download
              {...downloadHover}
              className="btn btn-secondary mt-3 h-10 min-h-0 w-full text-sm"
            >
              <Icon>
                <DownloadIcon ref={downloadRef} size={16} strokeWidth={1.75} />
              </Icon>
              {t.contact.info.cvAction}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
