import Link from "next/link";
import { ArrowUpRight, Calendar, Plus } from "lucide-react";
import { requireStaff } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/queries/admin/dashboard";
import { StatusChip } from "@/features/admin/ui/data-table";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const staff = await requireStaff();
  const data = await getDashboardData(staff.role);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-admin-card bg-admin-ink p-7 text-admin-on-ink lg:col-span-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 admin-text-chip text-white">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Webinar berikutnya
            </span>

            {data.nextWebinar ? (
              <div className="mt-5">
                <p className="admin-text-label font-normal opacity-75">
                  {data.nextWebinar.editionLabel} ·{" "}
                  {data.nextWebinar.formattedDate}
                </p>
                <h2 className="mt-1.5 admin-text-card-title">
                  {data.nextWebinar.title}
                </h2>
              </div>
            ) : (
              <div className="mt-5">
                <h2 className="admin-text-card-title">
                  Belum ada webinar terjadwal
                </h2>
                <p className="mt-1.5 admin-text-body opacity-75">
                  Tambahkan jadwal webinar baru agar banner beranda otomatis
                  menampilkan sesi terdekat.
                </p>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/admin/events/new"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-admin-on-ink px-5 admin-text-body font-medium text-admin-ink transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-on-ink"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah webinar</span>
            </Link>
            {data.nextWebinar && (
              <Link
                href={`/admin/events/${data.nextWebinar.id}`}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/25 px-5 admin-text-body font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-on-ink"
              >
                <span>Ubah detail</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-6">
          <Link
            href="/admin/events"
            className={cn(
              "flex flex-col justify-between rounded-admin-card border border-admin-line bg-admin-canvas p-6 transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
              adminFocusRing,
            )}
          >
            <span className="admin-text-label text-admin-text-secondary">
              Webinar terbit
            </span>
            <span className="mt-4 admin-text-display text-admin-ink">
              {data.metrics.events}
            </span>
          </Link>

          <Link
            href="/admin/faqs"
            className={cn(
              "flex flex-col justify-between rounded-admin-card border border-admin-line bg-admin-canvas p-6 transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
              adminFocusRing,
            )}
          >
            <span className="admin-text-label text-admin-text-secondary">
              FAQ tampil
            </span>
            <span className="mt-4 admin-text-display text-admin-ink">
              {data.metrics.faqs}
            </span>
          </Link>

          <Link
            href="/admin/team"
            className={cn(
              "flex flex-col justify-between rounded-admin-card border border-admin-line bg-admin-canvas p-6 transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
              adminFocusRing,
            )}
          >
            <span className="admin-text-label text-admin-text-secondary">
              Pengurus aktif
            </span>
            <span className="mt-4 admin-text-display text-admin-ink">
              {data.metrics.team}
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-admin-card border border-admin-line bg-admin-canvas p-7 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="admin-text-modal-title font-medium text-admin-ink">
              Perlu dilengkapi
            </h2>
            <StatusChip
              tone={data.incompleteItems.length > 0 ? "peach" : "mint"}
            >
              {data.incompleteItems.length > 0
                ? `${data.incompleteItems.length} item`
                : "Lengkap"}
            </StatusChip>
          </div>

          {data.incompleteItems.length === 0 ? (
            <p className="mt-4 admin-text-body text-admin-text-secondary">
              Semua konten utama sudah terisi lengkap.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-admin-line">
              {data.incompleteItems.map((item, idx) => (
                <li key={idx} className="py-3">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-sm admin-text-body text-admin-ink hover:underline",
                      adminFocusRing,
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-admin-text-secondary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {staff.role === "admin" && (
          <div className="rounded-admin-card border border-admin-line bg-admin-canvas p-7 lg:col-span-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="admin-text-modal-title font-medium text-admin-ink">
                Aktivitas terbaru
              </h2>
              <Link
                href="/admin/audit-log"
                className={cn(
                  "rounded-sm admin-text-label text-admin-text-secondary hover:text-admin-ink hover:underline",
                  adminFocusRing,
                )}
              >
                Lihat semua
              </Link>
            </div>

            {data.recentLogs.length === 0 ? (
              <p className="mt-4 admin-text-body text-admin-text-secondary">
                Belum ada riwayat perubahan melalui CMS.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-admin-line">
                {data.recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center justify-between gap-3 py-3 admin-text-body"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-admin-ink">
                        {log.table_name}
                      </span>{" "}
                      <span className="text-admin-text-secondary">
                        ({log.action})
                      </span>
                    </div>
                    <span className="shrink-0 admin-text-chip font-normal text-admin-text-secondary">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
