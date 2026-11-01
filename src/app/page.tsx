import { redirect } from "next/navigation";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/server/auth/current-user";

const LOOP = [
  ["Learn", "One powerful idea a day, in under 15 minutes."],
  ["Practise", "Rehearse it in an interactive exercise with instant feedback."],
  ["Apply", "Take a small mission into your real day."],
  ["Reflect", "Say what happened. Your coach reads the pattern."],
  ["Improve", "Tomorrow's training adapts. Come back, get better."],
] as const;

export default async function Landing() {
  const user = await getCurrentUser();
  if (user) redirect(user.onboarded ? "/home" : "/onboarding");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:max-w-5xl">
      <header className="py-4">
        <Wordmark />
      </header>
      <main className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <section className="pt-10 animate-rise lg:pt-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">A gym for the way you think and speak</p>
          <h1 className="mt-4 font-display text-[52px] leading-[0.98] tracking-[-0.01em] lg:text-[72px]">
            Become better
            <br />
            <span className="italic text-ink-2">every day.</span>
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-2">
            A personal training system for communication, confidence and leadership. Not a course — a daily coach that
            makes you practise what you learn.
          </p>
        </section>

        <ol className="mt-10 space-y-1 animate-rise [animation-delay:120ms] lg:mt-0">
          {LOOP.map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-line py-4 first:border-t-0">
              <span className="w-6 pt-0.5 font-mono text-[12px] text-muted">0{i + 1}</span>
              <div>
                <p className="font-display text-[22px] leading-none">{title}</p>
                <p className="mt-1.5 text-[14px] text-ink-2">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
      <div className="mt-10 space-y-3 lg:mx-auto lg:w-full lg:max-w-sm">
        <ButtonLink href="/register">Build my plan</ButtonLink>
        <ButtonLink href="/login" variant="ghost">
          I already have an account
        </ButtonLink>
      </div>
    </div>
  );
}
