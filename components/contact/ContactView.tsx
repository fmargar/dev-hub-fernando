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

  /* Los campos son casillas de un impreso: línea fina, fondo de ficha. */
  const fieldClass =
    "w-full border border-[var(--card-edge)] bg-white/60 px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60 focus:border-[var(--ink)] transition-colors";

  const details = [
    { label: t.contact.info.emailLabel, value: profile.email, href: `mailto:${profile.email}` },
    { label: t.contact.info.locationLabel, value: profile.location },
    { label: t.contact.info.responseLabel, value: t.contact.info.response },
  ];

  return (
    <>
      <div className="drawer-front">
        <div className="container-page flex flex-wrap items-center gap-5 py-6">
          <span className="drawer-pull" aria-hidden="true" />
          <span className="drawer-plate">{t.contact.title}</span>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {t.contact.intro}
          </p>
        </div>
      </div>

      <div className="container-page section grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section>
          <h2 className="divider-card">{t.contact.title}</h2>
          <div className="file">
            <div className="file-body">
              {isSubmitted ? (
                <div className="note">
                  <p className="flex items-center gap-2.5 text-lg font-bold">
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {t.contact.form.success}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">{t.contact.form.successDesc}</p>
                  <button
                    type="button"
                    onClick={handleSendAnother}
                    className="btn btn-secondary mt-5"
                  >
                    {t.contact.form.sendAnother}
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="typed uppercase block mb-1.5">
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
                    <label htmlFor="email" className="typed uppercase block mb-1.5">
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
                    <label htmlFor="message" className="typed uppercase block mb-1.5">
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
                    <p role="alert" className="text-sm font-bold text-[var(--stamp)]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary disabled:opacity-60"
                  >
                    {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="divider-card">{t.contact.info.emailLabel}</h2>
          <div className="file">
            <div className="file-body">
              <dl>
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-[var(--card-rule)] py-3.5 last:border-b-0"
                  >
                    <dt className="typed uppercase">{item.label}</dt>
                    <dd className="mt-1 text-sm">
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

              <div className="mt-6">
                <h3 className="typed uppercase">{t.contact.info.cvLabel}</h3>
                <a href={profile.cv} download className="btn btn-secondary mt-2.5 w-full">
                  <Download className="h-4 w-4" />
                  {t.contact.info.cvAction}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
