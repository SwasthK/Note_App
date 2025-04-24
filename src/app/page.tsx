"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/dark-mode";
import { NotebookPen } from "lucide-react";

const HomePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      } else {
        setIsChecking(false); // Done checking, no user
      }
    };

    checkAuth();
  }, [router, supabase]);

  // While checking auth, don't render the page
  if (isChecking) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NoteNest</h1>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline" size="sm">Register</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Capture Ideas. Organize Life.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            NoteNest is your personal space to jot down thoughts, to-dos, and dreams. Stay organized and access your notes anywhere, anytime.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <NotebookPen className="w-5 h-5" /> Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
