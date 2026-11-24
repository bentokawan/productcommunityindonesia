export type AdminRole = "admin" | "editor";

export type NavIcon =
  | "dashboard"
  | "home"
  | "image"
  | "handshake"
  | "compass"
  | "users"
  | "id-card"
  | "help"
  | "video"
  | "tag"
  | "settings"
  | "link"
  | "shield"
  | "activity";

export type NavModule = {
  label: string;
  href: string;
  icon: NavIcon;
  description: string;
  roles?: AdminRole[];
};

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  icon: NavIcon;
  modules: NavModule[];
  roles?: AdminRole[];
  description?: string;
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: "dashboard",
    modules: [],
    description: "Ringkasan konten situs PCI.",
  },
  {
    id: "beranda",
    label: "Konten Beranda",
    href: "/admin/hero",
    icon: "home",
    modules: [
      {
        label: "Hero",
        href: "/admin/hero",
        icon: "image",
        description: "Slide dan statistik di bagian paling atas beranda.",
      },
      {
        label: "Kolaborasi",
        href: "/admin/partners",
        icon: "handshake",
        description: "Nama partner yang tampil di strip Kolaborasi.",
      },
      {
        label: "Kegiatan",
        href: "/admin/activities",
        icon: "compass",
        description: "Kartu kegiatan komunitas di section Kegiatan.",
      },
      {
        label: "Grup Komunitas",
        href: "/admin/groups",
        icon: "users",
        description: "Grup WhatsApp tematik beserta logonya.",
      },
      {
        label: "Pengurus",
        href: "/admin/team",
        icon: "id-card",
        description: "Profil pengurus di section Pengurus.",
      },
      {
        label: "FAQ",
        href: "/admin/faqs",
        icon: "help",
        description: "Pertanyaan yang tampil di section FAQ beranda.",
      },
    ],
  },
  {
    id: "webinar",
    label: "Webinar",
    href: "/admin/events",
    icon: "video",
    modules: [
      {
        label: "Semua Webinar",
        href: "/admin/events",
        icon: "video",
        description: "Webinar yang tampil di beranda dan arsip /webinar.",
      },
      {
        label: "Kategori",
        href: "/admin/event-categories",
        icon: "tag",
        description: "Kategori yang menjadi tab di section Webinar.",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "user-activity",
    label: "User Activity",
    href: "/admin/audit-log",
    icon: "activity",
    roles: ["admin"],
    modules: [],
    description: "Riwayat perubahan konten oleh pengguna CMS.",
  },
];

export function filterNavGroups(role: AdminRole): NavGroup[] {
  return NAV_GROUPS.filter((g) => !g.roles || g.roles.includes(role)).map(
    (g) => ({
      ...g,
      modules: g.modules.filter((m) => !m.roles || m.roles.includes(role)),
    }),
  );
}

export function resolveNavMeta(pathname: string): {
  groupLabel: string | null;
  title: string;
  description: string;
} {
  if (pathname === "/admin/account") {
    return {
      groupLabel: null,
      title: "Pengaturan",
      description: "Informasi akun, keamanan, link sosial media, dan pengguna.",
    };
  }

  for (const group of NAV_GROUPS) {
    if (group.modules.length === 0 && pathname === group.href) {
      return {
        groupLabel: null,
        title: group.label,
        description: group.description ?? "",
      };
    }
    for (const mod of group.modules) {
      if (pathname === mod.href || pathname.startsWith(`${mod.href}/`)) {
        return {
          groupLabel: group.label,
          title: mod.label,
          description: mod.description,
        };
      }
    }
  }

  return {
    groupLabel: null,
    title: "Dashboard",
    description: "Ringkasan konten situs PCI.",
  };
}
