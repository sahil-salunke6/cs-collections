"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Newsletter({ className, variant = "default" }: { className?: string; variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setDone(true);
    toast.success("Subscribed!", { description: "Welcome to the squad. Check your inbox." });
    setEmail("");
    setTimeout(() => setDone(false), 4000);
  }

  return (
    <form onSubmit={submit} className={cn("flex w-full max-w-md gap-2", className)}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className={variant === "compact" ? "h-10" : "h-12"}
      />
      <Button type="submit" size={variant === "compact" ? "default" : "lg"} variant="accent" className="shrink-0">
        {done ? <Check className="size-4" /> : <Send className="size-4" />}
        <span className="hidden sm:inline">{done ? "Done" : "Subscribe"}</span>
      </Button>
    </form>
  );
}
