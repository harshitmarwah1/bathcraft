"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon, { type IconName } from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";
import { useAuth } from "./AuthProvider";
import { TextField } from "./fields";

const INTENTS: { id: string; label: string; icon: IconName }[] = [
  { id: "renovating", label: "Renovating an existing bathroom", icon: "hammer" },
  { id: "new-build", label: "Building a new bathroom", icon: "building" },
  { id: "exploring", label: "Exploring ideas for now", icon: "lightbulb" },
];

const PRIORITIES: { id: string; label: string; icon: IconName }[] = [
  { id: "budget", label: "Stay within budget", icon: "wallet" },
  { id: "space", label: "Make better use of space", icon: "ruler" },
  { id: "visualize", label: "Visualize before building", icon: "eye" },
  { id: "products", label: "Choose the right products", icon: "cart" },
  { id: "mistakes", label: "Avoid renovation mistakes", icon: "shield" },
  { id: "premium", label: "Create a premium bathroom", icon: "sparkle" },
];

/** Three questions, one at a time, with the answers kept in the auth store. */
export default function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const t = useT();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);

  const togglePriority = (id: string) =>
    setPriorities((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function next() {
    if (saving) return;
    if (step === 1) {
      if (!name.trim()) {
        setNameError(t("Give this bathroom a name so you can find it later."));
        return;
      }
      setNameError(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    // Persist first, then navigate. Pushing early would race the session
    // refresh and /auth/continue would send them straight back here.
    setSaving(true);
    try {
      await completeOnboarding({ bathroomName: name.trim(), intent, priorities });
      router.push("/bathrooms");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-brand uppercase">
          {t("Step")} {step} {t("of")} 3
        </p>
        <div
          className="mt-3 flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
          aria-label={t("Onboarding progress")}
        >
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={[
                "h-[3px] flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-brand" : "bg-field",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div key={step} className="animate-[panel-in_260ms_ease-out_both] motion-reduce:animate-none">
        {step === 1 && (
          <>
            <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
              {t("Let’s create your first bathroom.")}
            </h1>
            <p className="mt-3 text-[15px] text-body">
              {t("What would you like to call this bathroom?")}
            </p>
            <form
              className="mt-7"
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <TextField
                label={t("Bathroom name")}
                placeholder={t("e.g. Master Bathroom")}
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                error={nameError}
              />
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
              {t("What are you planning?")}
            </h1>
            <ul className="mt-7 space-y-3">
              {INTENTS.map(({ id, label, icon }) => (
                <li key={id}>
                  <ChoiceCard
                    selected={intent === id}
                    icon={icon}
                    label={t(label)}
                    onSelect={() => setIntent(id)}
                    role="radio"
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
              {t("What matters most to you?")}
            </h1>
            <p className="mt-3 text-[15px] text-body">{t("Choose as many as you like.")}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {PRIORITIES.map(({ id, label, icon }) => (
                <li key={id}>
                  <ChoiceCard
                    selected={priorities.includes(id)}
                    icon={icon}
                    label={t(label)}
                    onSelect={() => togglePriority(id)}
                    role="checkbox"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-9 flex items-center gap-4">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-[13.5px] font-semibold text-body transition-colors hover:text-brand"
          >
            {t("← Back")}
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={saving}
          className="ml-auto flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-brand px-7 text-[15px] font-semibold text-on-brand shadow-[0_6px_18px_rgb(7_140_200/0.28)] transition-[transform,background-color,opacity] duration-200 hover:-translate-y-px hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
        >
          {saving ? t("Saving…") : step === 3 ? t("Start Planning") : t("Continue")}
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}

function ChoiceCard({
  selected,
  icon,
  label,
  onSelect,
  role,
}: {
  selected: boolean;
  icon: IconName;
  label: string;
  onSelect: () => void;
  role: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-3.5 rounded-[14px] border bg-surface-raised px-4 py-4 text-left",
        "transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0",
        selected ? "border-brand bg-wash" : "border-field hover:border-brand/40",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
          selected ? "bg-brand text-on-brand" : "bg-wash text-brand",
        ].join(" ")}
      >
        <Icon name={icon} size={20} />
      </span>
      <span className="text-[14.5px] font-medium text-ink">{label}</span>
      <span
        className={[
          "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          selected ? "border-brand bg-brand text-on-brand" : "border-field text-transparent",
        ].join(" ")}
        aria-hidden="true"
      >
        <Icon name="check" size={12} strokeWidth={2.6} />
      </span>
    </button>
  );
}
