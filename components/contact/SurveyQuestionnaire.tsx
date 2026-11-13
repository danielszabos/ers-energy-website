"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { requestSurvey } from "@/app/contact/actions";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { company } from "@/lib/site";
import {
  allSurveyFields,
  emptySurvey,
  surveyFields,
  surveySteps,
  validateField,
  validateSurvey,
  type SurveyErrors,
  type SurveyField,
} from "@/lib/survey";

type Control = HTMLInputElement | HTMLSelectElement;

/** Scrolls the card's top back into view if it has gone up behind the nav. */
function revealTop(element: HTMLElement | null) {
  if (!element) return;
  const navSpace = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  if (element.getBoundingClientRect().top >= navSpace) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
}

/**
 * The contact page's survey request, asked one short step at a time. Each step's
 * answers are checked before moving on, and answers are kept when going back.
 */
export function SurveyQuestionnaire() {
  const [step, setStep] = useState(0);
  // Unset until the visitor first changes step, so the first step doesn't animate in.
  const [direction, setDirection] = useState<"forward" | "back">();
  const [values, setValues] = useState(emptySurvey);
  const [errors, setErrors] = useState<SurveyErrors>({});
  const [sent, setSent] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const cardRef = useRef<HTMLDivElement>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);
  const controls = useRef<Partial<Record<SurveyField, Control | null>>>({});
  // The question to put the cursor in once the next step has rendered.
  const focusNext = useRef<SurveyField | null>(null);

  const current = surveySteps[step];
  const isLast = step === surveySteps.length - 1;

  useEffect(() => {
    const field = focusNext.current;
    focusNext.current = null;
    if (!field) return;
    revealTop(cardRef.current);
    controls.current[field]?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (!sent) return;
    revealTop(cardRef.current);
    doneHeadingRef.current?.focus({ preventScroll: true });
  }, [sent]);

  function goTo(index: number, field: SurveyField) {
    if (index === step) {
      controls.current[field]?.focus();
      return;
    }
    setDirection(index > step ? "forward" : "back");
    focusNext.current = field;
    setStep(index);
  }

  function update(field: SurveyField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Once a problem is showing, clear it as soon as the answer is fixed.
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: validateField(field, value) }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const stepErrors = validateSurvey(values, current.fields);
    setErrors((previous) => {
      const next = { ...previous };
      for (const field of current.fields) next[field] = stepErrors[field];
      return next;
    });
    const firstProblem = current.fields.find((field) => stepErrors[field]);
    if (firstProblem) {
      controls.current[firstProblem]?.focus();
      return;
    }

    if (!isLast) {
      goTo(step + 1, surveySteps[step + 1].fields[0]);
      return;
    }

    setSendFailed(false);
    startTransition(async () => {
      try {
        const result = await requestSurvey(values);
        if (result.ok) {
          setSent(true);
          return;
        }
        // The server disagreed with an answer: go back to the first one it flagged.
        const serverErrors = result.errors ?? {};
        const field = allSurveyFields.find((f) => serverErrors[f]);
        if (!field) {
          setSendFailed(true);
          return;
        }
        setErrors(serverErrors);
        goTo(
          surveySteps.findIndex((s) => s.fields.includes(field)),
          field,
        );
      } catch {
        setSendFailed(true);
      }
    });
  }

  if (sent) {
    return (
      <div ref={cardRef} className="survey-done border border-border-grey bg-white p-6 sm:p-10">
        <span className="flex size-12 items-center justify-center bg-green-tint text-deep-green">
          <Icon name="check" className="size-6" strokeWidth={2} />
        </span>
        <h2
          ref={doneHeadingRef}
          tabIndex={-1}
          className="mt-6 text-[1.75rem] leading-tight font-bold tracking-[-0.015em] text-deep-base outline-none sm:text-[2rem]"
        >
          Thanks, we&apos;ve got your details
        </h2>
        <p className="mt-4 max-w-lg leading-relaxed text-charcoal sm:text-lg sm:leading-relaxed">
          Someone from the team will be in touch soon to arrange your survey. If it&apos;s
          urgent, call us on{" "}
          <a
            href={company.phone.href}
            className="font-semibold whitespace-nowrap text-deep-green underline-offset-4 hover:underline"
          >
            {company.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="overflow-hidden border border-border-grey bg-white p-6 sm:p-10">
      <div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
        {surveySteps.map((s, i) => (
          <span
            key={s.title}
            className={cn(
              "h-1 transition-colors duration-500",
              i <= step ? "bg-brand-green" : "bg-border-grey",
            )}
          />
        ))}
      </div>

      <form noValidate onSubmit={handleSubmit} aria-label="Request a survey" className="mt-8">
        <fieldset key={step} data-direction={direction} className="survey-step min-w-0">
          {/* Read out with each question, so "Step 2 of 3, Contact" is announced too. */}
          <legend className="w-full">
            <span className="block font-heading text-xs font-semibold tracking-[0.14em] text-deep-green uppercase">
              Step {step + 1} of {surveySteps.length}
            </span>
            <span className="mt-3 block font-heading text-[1.75rem] leading-tight font-bold tracking-[-0.015em] text-deep-base sm:text-[2rem]">
              {current.title}
            </span>
          </legend>
          <p className="mt-3 leading-relaxed text-charcoal">{current.intro}</p>

          <div className="mt-8 space-y-6">
            {current.fields.map((field) => (
              <Question
                key={field}
                field={field}
                value={values[field]}
                error={errors[field]}
                onChange={(value) => update(field, value)}
                controlRef={(element) => {
                  controls.current[field] = element;
                }}
              />
            ))}
          </div>
        </fieldset>

        {sendFailed && (
          <p
            role="alert"
            className="mt-8 border-l-4 border-error bg-error/[0.06] px-4 py-3 text-[0.9375rem] leading-relaxed text-deep-base"
          >
            Sorry, we couldn&apos;t send your details. Please try again, or call us on{" "}
            <a
              href={company.phone.href}
              className="font-semibold whitespace-nowrap text-deep-green underline-offset-4 hover:underline"
            >
              {company.phone.display}
            </a>
            .
          </p>
        )}

        <div
          className={cn(
            "mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center",
            step > 0 ? "sm:justify-between" : "sm:justify-end",
          )}
        >
          {step > 0 && (
            <button
              type="button"
              onClick={() => goTo(step - 1, surveySteps[step - 1].fields[0])}
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-heading text-[0.9375rem] font-semibold text-charcoal transition-colors duration-200 hover:text-deep-base disabled:opacity-50 sm:-ml-4"
            >
              <Icon name="arrow-left" className="size-[1.15em]" />
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className={buttonClasses({ className: "disabled:cursor-wait disabled:opacity-70" })}
          >
            {pending ? "Sending…" : isLast ? "Request a survey" : "Continue"}
            {!pending && <Icon name="arrow-right" />}
          </button>
        </div>
        <p aria-live="polite" className="sr-only">
          {pending ? "Sending your details" : ""}
        </p>
      </form>
    </div>
  );
}

function Question({
  field,
  value,
  error,
  onChange,
  controlRef,
}: {
  field: SurveyField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  controlRef: (element: Control | null) => void;
}) {
  const config = surveyFields[field];
  const id = `survey-${field}`;
  const hintId = config.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const shared = {
    id,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
  };
  // Text is 16px so phones don't zoom in on focus. The global focus ring sits
  // right on the border, thickening it into a clear green outline.
  const controlClasses = cn(
    "block h-12 w-full rounded-[2px] border bg-white px-4 text-base text-deep-base transition-colors duration-150 focus-visible:outline-offset-0",
    error ? "border-error" : "border-mid-grey hover:border-charcoal focus:border-deep-green",
  );

  return (
    <div>
      <label htmlFor={id} className="block font-heading text-[0.9375rem] font-semibold text-deep-base">
        {config.label}
      </label>
      {config.hint && (
        <p id={hintId} className="mt-1 text-sm text-mid-grey">
          {config.hint}
        </p>
      )}

      <div className="relative mt-2">
        {config.type === "select" ? (
          <>
            <select
              {...shared}
              ref={controlRef}
              onChange={(event) => onChange(event.target.value)}
              className={cn(
                controlClasses,
                "cursor-pointer appearance-none pr-11 [&>option]:text-deep-base",
                !value && "text-mid-grey",
              )}
            >
              <option value="" disabled>
                {config.placeholder}
              </option>
              {config.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-charcoal"
            />
          </>
        ) : (
          <input
            {...shared}
            ref={controlRef}
            type={config.type}
            onChange={(event) => onChange(event.target.value)}
            autoComplete={config.autoComplete}
            maxLength={config.maxLength}
            spellCheck={config.type === "text" && !config.uppercase ? undefined : false}
            autoCapitalize={config.uppercase ? "characters" : undefined}
            className={cn(controlClasses, config.uppercase && "uppercase")}
          />
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-error">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      )}
    </div>
  );
}
