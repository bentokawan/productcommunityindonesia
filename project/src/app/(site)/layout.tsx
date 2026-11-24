import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-brand-500 focus:px-5 focus:py-2.5 focus:text-button focus:text-ink-900 focus:outline-2 focus:outline-offset-2 focus:outline-ink-900"
      >
        Lewati ke konten utama
      </a>
      {children}
      <Analytics />
      <SpeedInsights />
    </SmoothScrollProvider>
  );
}
