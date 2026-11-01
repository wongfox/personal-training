import Link from "next/link";
import { Wordmark } from "@/components/brand";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-8">
      <header className="py-4">
        <Link href="/" aria-label="Personal Growth OS home">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 flex-col pt-6 animate-rise">{children}</main>
    </div>
  );
}
