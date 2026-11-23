import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { SectionHeading } from "@/components/ui/section-heading";

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main>
      <Section tone="dark">
        <Container className="space-y-8">
          <Logo variant="navbar" />
          <div className="flex flex-wrap gap-3">
            <Badge variant="pill">💡 Step by step, sampai idenya nyala</Badge>
            <Badge variant="chip">#SharingSession7</Badge>
            <Badge variant="status">WEBINAR BERIKUTNYA</Badge>
            <Badge variant="caption">PCI × IPC 2026</Badge>
          </div>
          <SectionHeading
            align="left"
            eyebrow="UI PRIMITIVES (DARK)"
            title={
              <>
                Belajar & Bertumbuh Bersama <em>Komunitas Product Indonesia</em>
              </>
            }
            description="Halaman review varian komponen situs publik."
          />
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" href="#light" external>
              Gabung Grup WhatsApp
            </Button>
            <Button variant="outline" href="#light">
              Lihat Webinar
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="light" id="light">
        <Container className="space-y-8">
          <SectionHeading
            align="center"
            eyebrow="UI PRIMITIVES (LIGHT)"
            title={
              <>
                Dari product people, <em>untuk product people.</em>
              </>
            }
            description="Review Card, Button, dan Accordion pada tone light."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card tone="outlined" className="p-6">
              <p className="text-title">Card Outlined</p>
              <p className="mt-2 text-small text-(--color-fg-muted)">
                Contoh konten di dalam kartu outlined.
              </p>
            </Card>
            <Card tone="inverse">
              <p className="text-eyebrow text-brand-500">VISI</p>
              <p className="mt-3 text-quote">
                Card inverse dengan latar ink-900 dan teks putih.
              </p>
            </Card>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="dark" href="#light" external>
              Button Dark
            </Button>
            <Button variant="outline" href="#light">
              Button Outline
            </Button>
          </div>
          <Accordion
            items={[
              {
                id: "1",
                question: "Apakah gabung komunitas PCI berbayar?",
                answer:
                  "Gabung grup komunitasnya gratis dan terbuka untuk umum.",
              },
            ]}
          />
        </Container>
      </Section>
    </main>
  );
}
