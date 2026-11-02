import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { localDate } from "@/lib/dates";
import { requirePermission } from "@/server/auth/current-user";
import { can, grantableRoles, ROLE_KEYS } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getAdminUser } from "@/server/services/admin";
import { getProfileData } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { uuidSchema } from "@/server/validation";
import { userRoleAction, userStatusAction } from "../../actions";
import { ActionButton } from "../../form";
import { formatDate, formatNumber, PageHeader, Panel, PanelTitle, StatusBadge } from "../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.user.metaTitle") };
}

export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const actor = await requirePermission("users:read");
  const { t, locale } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const db = getDb();
  let user;
  try {
    user = await getAdminUser(db, id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const [plan, profile] = await Promise.all([getActivePlan(db, id), getProfileData(db, id, localDate("UTC"))]);
  const manage = can(actor.roles, "users:manage") && actor.id !== id;
  const grantable = grantableRoles(actor.roles);
  const stats: [string, string | number][] = [
    [t("admin.user.stats.level"), `${profile.level.level} · ${t(`common.levels.${profile.level.name}`)}`],
    [t("admin.user.stats.xp"), formatNumber(profile.totalXp, locale)],
    [t("admin.user.stats.streak"), t("admin.user.stats.streakValue", { current: profile.streak.current, longest: profile.streak.longest })],
    [t("admin.user.stats.daysTrained"), profile.totals.daysTrained],
    [t("admin.user.stats.lessons"), profile.totals.lessons],
    [t("admin.user.stats.missions"), profile.totals.actions],
    [t("admin.user.stats.exercises"), profile.totals.exercises],
    [t("admin.user.stats.minutes"), formatNumber(profile.totals.minutes, locale)],
  ];

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={user.name}
        subtitle={t("admin.user.subtitle", { email: user.email, date: formatDate(user.createdAt, locale) })}
        crumbs={[{ href: "/admin/users", label: t("admin.users.title") }]}
        action={<StatusBadge status={user.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle>{t("admin.user.progress")}</PanelTitle>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] text-muted">{k}</dt>
                <dd className="text-[16px] font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <PanelTitle className="mt-6">{t("admin.user.skills")}</PanelTitle>
          <ul className="mt-2 space-y-2">
            {profile.skills.map((s) => (
              <li key={s.key} className="flex items-center gap-3 text-[14px]">
                <span className="w-24 shrink-0 truncate sm:w-28">{t(`taxonomy.skills.${s.key}`)}</span>
                <div className="h-2 flex-1 rounded-full bg-surface-2">
                  <div className="h-2 rounded-full bg-hero" style={{ width: `${s.score}%` }} />
                </div>
                <span className="w-16 text-right tabular-nums text-ink-2 sm:w-20">
                  {s.baseline} → {s.score}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelTitle>{t("admin.user.plan")}</PanelTitle>
            {plan ? (
              <dl className="mt-2 space-y-1.5 text-[14px]">
                <div>
                  <dt className="text-[12px] text-muted">{t("admin.user.primaryGoal")}</dt>
                  <dd>{plan.primaryGoalName}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-muted">{t("admin.user.commitment")}</dt>
                  <dd>{t("admin.user.commitmentValue", { minutes: plan.dailyMinutes, frequency: t(`admin.user.frequency.${plan.frequency}`) })}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-muted">{t("admin.user.started")}</dt>
                  <dd>{formatDate(plan.startDate, locale)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-[14px] text-muted">{t("admin.user.notOnboarded")}</p>
            )}
          </Panel>

          <Panel>
            <PanelTitle>{t("admin.user.roles")}</PanelTitle>
            <ul className="mt-3 space-y-2">
              {ROLE_KEYS.map((r) => {
                const has = user.roles.includes(r);
                const editable = manage && grantable.includes(r) && r !== "USER";
                return (
                  <li key={r} className="flex items-center justify-between gap-2 text-[14px]">
                    <span className={has ? "font-medium" : "text-muted"} title={t(`admin.roles.${r}.description`)}>
                      {t(`admin.roles.${r}.name`)}
                    </span>
                    {editable ? (
                      <ActionButton
                        action={userRoleAction}
                        label={has ? t("admin.user.revoke") : t("admin.user.grant")}
                        hidden={{ userId: user.id, role: r, grant: has ? "0" : "1" }}
                        tone={has ? "danger" : "default"}
                      />
                    ) : (
                      <span className="text-[12px] text-muted">{has ? t("admin.user.has") : "—"}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          {manage && (
            <Panel>
              <PanelTitle>{t("admin.user.account")}</PanelTitle>
              <div className="mt-3">
                {user.status === "active" ? (
                  <ActionButton
                    action={userStatusAction}
                    label={t("admin.user.suspend")}
                    tone="danger"
                    hidden={{ userId: user.id, status: "suspended" }}
                    confirm={t("admin.user.suspendConfirm")}
                  />
                ) : (
                  <ActionButton action={userStatusAction} label={t("admin.user.reactivate")} hidden={{ userId: user.id, status: "active" }} />
                )}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
