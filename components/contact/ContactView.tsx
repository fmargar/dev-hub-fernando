"use client";

import React, { useRef, useState } from "react";
import { Check, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { profile } from "@/content/profile";

export function ContactView() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error");
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setError(null);
    formRef.current?.reset();
  };

  const fieldClass =
    "w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--primary)] transition-colors";

  const details = [
    { label: t.contact.info.emailLabel, value: profile.email, href: `mailto:${profile.email}` },
    { label: t.contact.info.locationLabel, value: profile.location },
    { label: t.contact.info.availabilityLabel, value: t.contact.info.availability },
    { label: t.contact.info.responseLabel, value: t.contact.info.response },
  ];

  return (
    <div className="container-page py-16 md:py-24">
      <header className="measure">
        <h1 className="display-1">{t.contact.title}</h1>
        <p className="body-copy mt-6">{t.contact.intro}</p>
      </header>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
        <div className="min-w-0 max-w-xl">
          {isSubmitted ? (
            <div className="surface p-8">
              <p className="flex items-center gap-2.5 font-serif text-xl font-semibold">
                <Check className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                {t.contact.form.success}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{t.contact.form.successDesc}</p>
              <button type="button" onClick={handleSendAnother} className="btn btn-secondary mt-6">
                {t.contact.form.sendAnother}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="eyebrow block mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={t.contact.form.namePlaceholder}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="eyebrow block mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="eyebrow block mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder={t.contact.form.messagePlaceholder}
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-[var(--destructive)]">
                  {error}
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-60">
                {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
              </button>
            </form>
          )}
        </div>

        <aside>
          <dl className="border-t border-[var(--rule)]">
            {details.map((item) => (
              <div key={item.label} className="border-b border-[var(--rule)] py-4">
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-1.5 text-sm">
                  {item.href ? (
                    <a href={item.href} className="link-quiet break-all">
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
            <p className="eyebrow">{t.contact.info.cvLabel}</p>
            <a href={profile.cv} download className="btn btn-secondary mt-3 w-full">
              <Download className="h-4 w-4" />
              {t.contact.info.cvAction}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
