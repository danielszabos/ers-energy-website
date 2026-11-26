"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { suggestEmail } from "@/lib/emailAddress";
import { company } from "@/lib/site";
import {
  SURVEY_TRAP_FIELD,
  allSurveyFields,
  contactPromise,
  emptySurvey,
  surveyFields,
  surveySteps,
  validateField,
  validateSurvey,
  type SurveyErrors,
  type SurveyField,
  type SurveyResult,
  type SurveyValues,
} from "@/lib/survey";

type Control = HTMLInputElement | HTMLSelectElement;

/**
 * Sends the answers to /api/survey (lib/surveyRequest), which emails them to
 * ERS and a confirmation to the customer. Throws if there's no usable answer.
 * `postcodeConfirmed` once the visitor has said an unlisted postcode is right.
 */
async function sendSurvey(
  values: SurveyValues,
  trap: string,
  postcodeConfirmed: boolean,
): Promise<SurveyResult> {
  const response = await fetch("/api/survey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, [SURVEY_TRAP_FIELD]: trap, postcodeConfirmed }),
  });
  return (await response.json()) as SurveyResult;
}

/**
 * Asks /api/survey/email whether the email address's domain exists (only the
 * server can look that up): the problem to show, or undefined if it's fine or
 * the check couldn't be made. The server checks again when the form is sent.
 */
async function checkEmail(email: string): Promise<string | undefined> {
  try {
    const response = await fetch("/api/survey/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = (await response.json()) as SurveyResult;
    return result.ok ? undefined : result.errors?.email;
  } catch {
    return undefined;
  }
}

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
  // The postcode isn't on the official list but its district is real: offer
  // to send it anyway, as a new building's postcode may not be listed yet.
  const [offerPostcode, setOfferPostcode] = useState(false);
  const postcodeConfirmed = useRef(false);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);
  const controls = useRef<Partial<Record<SurveyField, Control | null>>>({});
  const trapRef = useRef<HTMLInputElement>(null);
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
    if (field === "postcode") {
      setOfferPostcode(false);
      postcodeConfirmed.current = false;
    }
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

    if (!isLast && current.fields.includes("email")) {
      // Before leaving the Contact step, make sure the email's domain exists.
      startTransition(async () => {
        const problem = await checkEmail(values.email);
        if (problem) {
          setErrors((previous) => ({ ...previous, email: problem }));
          controls.current.email?.focus();
          return;
        }
        goTo(step + 1, surveySteps[step + 1].fields[0]);
      });
      return;
    }

    if (!isLast) {
      goTo(step + 1, surveySteps[step + 1].fields[0]);
      return;
    }

    setSendFailed(false);
    startTransition(async () => {
      try {
        const result = await sendSurvey(
          values,
          trapRef.current?.value ?? "",
          postcodeConfirmed.current,
        );
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
        setOfferPostcode(field === "postcode" && result.confirmPostcode === true);
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
          Someone from the team will {contactPromise(values.preferredContact)} soon to arrange
          your survey. If it&apos;s
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

      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        aria-label="Request a survey"
        className="mt-8"
      >
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
            {/* The preferred contact has no question of its own: it's set by the
                "Preferred" switches by the email and phone boxes. */}
            {current.fields
              .filter((field) => surveyFields[field].type !== "preference")
              .map((field) => (
                <Question
                  key={field}
                  field={field}
                  value={values[field]}
                  error={errors[field]}
                  onChange={(value) => update(field, value)}
                  controlRef={(element) => {
                    controls.current[field] = element;
                  }}
                  preferredContact={values.preferredContact}
                  onPreferredContactChange={(value) => update("preferredContact", value)}
                  errorAction={
                    field === "postcode" && offerPostcode
                      ? {
                          label: "Send with this postcode",
                          onClick: () => {
                            postcodeConfirmed.current = true;
                            setOfferPostcode(false);
                            setErrors((previous) => ({ ...previous, postcode: undefined }));
                            formRef.current?.requestSubmit();
                          },
                        }
                      : undefined
                  }
                />
              ))}
          </div>
        </fieldset>

        {/* The spam trap (lib/survey): hidden from people, screen readers and the
            Tab key, but there for anything that fills in every box. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="survey-trap">Leave this blank</label>
          <input
            ref={trapRef}
            id="survey-trap"
            name={SURVEY_TRAP_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

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
            {pending ? (isLast ? "Sending…" : "Checking…") : isLast ? "Request a survey" : "Continue"}
            {!pending && <Icon name="arrow-right" />}
          </button>
        </div>
        <p aria-live="polite" className="sr-only">
          {pending ? (isLast ? "Sending your details" : "Checking your email address") : ""}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-mid-grey">
          We&apos;ll use your details to reply to your request and arrange your survey. Our{" "}
          <Link
            href="/privacy-policy"
            className="rounded-[2px] font-semibold text-deep-green underline underline-offset-4 hover:decoration-2"
          >
            privacy policy
          </Link>{" "}
          explains how we look after them.
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
  preferredContact,
  onPreferredContactChange,
  errorAction,
}: {
  field: SurveyField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  controlRef: (element: Control | null) => void;
  preferredContact: string;
  onPreferredContactChange: (value: string) => void;
  /** A way past the problem, shown under it ("Send with this postcode"). */
  errorAction?: { label: string; onClick: () => void };
}) {
  // For the email box: the address they probably meant, if it looks mistyped.
  // Worked out when they leave the box, so it doesn't flicker while typing.
  const [suggestion, setSuggestion] = useState<string>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const config = surveyFields[field];
  if (config.type === "preference") return null;
  const id = `survey-${field}`;
  const hintId = config.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const preference = "preference" in config ? config.preference : undefined;
  const preferred = preference !== undefined && preferredContact === preference;
  const shownSuggestion =
    config.type === "email" ? (suggestion ?? (error ? suggestEmail(value) : undefined)) : undefined;
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
    // A grid, so a "Preferred" switch can sit at the end of the label's line
    // while still coming straight after its box when moving through with Tab.
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4">
      <label
        htmlFor={id}
        className="col-start-1 row-start-1 block font-heading text-[0.9375rem] font-semibold text-deep-base"
      >
        {config.label}
      </label>
      {config.hint && (
        <p id={hintId} className="col-span-2 mt-1 text-sm text-mid-grey">
          {config.hint}
        </p>
      )}

      <div className="relative col-span-2 mt-2">
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
            ref={(element) => {
              inputRef.current = element;
              controlRef(element);
            }}
            type={config.type}
            onChange={(event) => {
              setSuggestion(undefined);
              onChange(event.target.value);
            }}
            onBlur={config.type === "email" ? () => setSuggestion(suggestEmail(value)) : undefined}
            autoComplete={config.autoComplete}
            maxLength={config.maxLength}
            spellCheck={config.type === "text" && !config.uppercase ? undefined : false}
            autoCapitalize={config.uppercase ? "characters" : undefined}
            className={cn(controlClasses, config.uppercase && "uppercase")}
          />
        )}
      </div>

      {/* Marks this as the way they'd prefer to be contacted. Pressing it again
          clears it, and pressing the other one moves it there, so at most one
          is on; neither means no preference. */}
      {preference !== undefined && (
        <button
          type="button"
          aria-pressed={preferred}
          onClick={() => onPreferredContactChange(preferred ? "" : preference)}
          className={cn(
            "group col-start-2 row-start-1 -my-1 inline-flex items-center gap-2 rounded-[2px] py-1 text-sm font-medium transition-colors duration-150",
            preferred ? "text-deep-green" : "text-charcoal hover:text-deep-base",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
              preferred ? "border-deep-green" : "border-mid-grey group-hover:border-charcoal",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full bg-deep-green transition-transform duration-150",
                preferred ? "scale-100" : "scale-0",
              )}
            />
          </span>
          Preferred<span className="sr-only"> ({config.label.toLowerCase()})</span>
        </button>
      )}

      {error && (
        <p id={errorId} className="col-span-2 mt-2 text-sm font-medium text-error">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      )}
      {error && errorAction && (
        <div className="col-span-2 mt-3">
          <button
            type="button"
            onClick={errorAction.onClick}
            className={buttonClasses({ variant: "outline-dark", size: "sm" })}
          >
            {errorAction.label}
          </button>
        </div>
      )}

      {/* The address they probably meant: shown when they leave the box, and
          with any problem with the address. Read out when it appears; pressing
          the address puts it in the box. */}
      {config.type === "email" && (
        <div aria-live="polite" className="col-span-2">
          {shownSuggestion && (
            <p className="mt-2 text-sm text-charcoal">
              Did you mean{" "}
              <button
                type="button"
                onClick={() => {
                  onChange(shownSuggestion);
                  setSuggestion(undefined);
                  inputRef.current?.focus();
                }}
                className="rounded-[2px] font-semibold break-all text-deep-green underline underline-offset-4 hover:decoration-2"
              >
                {shownSuggestion}
              </button>
              ?
            </p>
          )}
        </div>
      )}
    </div>
  );
}
