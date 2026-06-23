"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Instagram, MessageCircle } from "lucide-react";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Required"),
  message: z.string().min(10, "Tell us a little more (10+ chars)"),
});
type Values = z.infer<typeof schema>;

const CONTACTS = [
  { icon: MessageCircle, title: "WhatsApp", value: "+91 86579 73913", href: "https://wa.me/918657973913" },
  { icon: MessageCircle, title: "WhatsApp", value: "+91 72190 60279", href: "https://wa.me/917219060279" },
  { icon: Instagram, title: "Instagram", value: "@_cs_collections_", href: "https://instagram.com/_cs_collections_" },
  { icon: Mail, title: "Email", value: "support@cscollections.com", href: "mailto:support@cscollections.com" },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent!", { description: "Our team will get back to you within 24 hours." });
    reset();
  }

  return (
    <>
      <PageHeader
        title="Get in touch"
        description="Questions about sizing, an order, or just want to talk football? We're here to help."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register("subject")} />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} {...register("message")} />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </form>

          <div className="space-y-4">
            <a
              href="https://wa.me/918657973913"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-5" /> Chat with us on WhatsApp
            </a>
            {CONTACTS.map((i) => (
              <a
                key={i.title + i.value}
                href={i.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <i.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{i.title}</p>
                  <p className="text-sm text-muted-foreground">{i.value}</p>
                </div>
              </a>
            ))}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary p-5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" /> Based in India · Shipping nationwide
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
