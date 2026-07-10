import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-zinc-400">Event not found</p>
      <Button asChild className="mt-8">
        <Link href="/">Back to events</Link>
      </Button>
    </div>
  );
}
