import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h2",
            "h3",
            "h4",
            "title",
            "quote",
            "stat",
            "lead",
            "faq-q",
            "button",
            "nav",
            "nav-mobile",
            "tab",
            "body",
            "body-sm",
            "meta",
            "small",
            "eyebrow",
            "chip",
            "mono",
          ],
        },
        {
          "admin-text": [
            "display",
            "page-title",
            "card-title",
            "modal-title",
            "section-label",
            "body",
            "label",
            "nav",
            "meta",
            "chip",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const eventDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatEventDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return eventDateFormatter.format(date);
}
