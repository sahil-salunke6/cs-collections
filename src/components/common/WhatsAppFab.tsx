import { MessageCircle } from "lucide-react";

/** Floating WhatsApp contact button (bottom-left to avoid the toast region). */
export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/918657973913?text=Hi%20CS%20Collections!%20I%20have%20a%20question%20about%20a%20jersey."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
