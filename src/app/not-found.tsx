import Link from "next/link";
import { LogoMark } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center px-6 text-center">
      <LogoMark size={40} />
      <h1 className="mt-8 font-display text-[34px] leading-tight">Nothing here.</h1>
      <p className="mt-3 text-[15px] text-ink-2">The page you were looking for doesn&apos;t exist or isn&apos;t open to you.</p>
      <Link href="/home" className="mt-8 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg">
        Back to today
      </Link>
    </div>
  );
}
