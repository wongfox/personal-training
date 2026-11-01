import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localDate } from "@/lib/dates";
import { requirePermission } from "@/server/auth/current-user";
import { can, grantableRoles, ROLE_INFO, ROLE_KEYS } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getAdminUser } from "@/server/services/admin";
import { getProfileData } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { uuidSchema } from "@/server/validation";
import { userRoleAction, userStatusAction } from "../../actions";
import { ActionButton } from "../../form";
import { PageHeader, Panel, StatusBadge } from "../../ui";

export const metadata: Metadata = { title: "Learner" };

export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const actor = await requirePermission("users:read");
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

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={user.name}
        subtitle={`${user.email} · joined ${user.createdAt.toISOString().slice(0, 10)}`}
        crumbs={[{ href: "/admin/users", label: "Users" }]}
        action={<StatusBadge status={user.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className="text-[15px] font-semibold">Progress</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Level", `${profile.level.level} · ${profile.level.name}`],
              ["XP", profile.totalXp],
              ["Streak", `${profile.streak.current} (best ${profile.streak.longest})`],
              ["Days trained", profile.totals.daysTrained],
              ["Lessons", profile.totals.lessons],
              ["Missions", profile.totals.actions],
              ["Exercises", profile.totals.exercises],
              ["Minutes", profile.totals.minutes],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="text-[12px] text-muted">{k}</dt>
                <dd className="text-[16px] font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Skills</h3>
          <ul className="mt-2 space-y-2">
            {profile.skills.map((s) => (
              <li key={s.key} className="flex items-center gap-3 text-[14px]">
                <span className="w-28 shrink-0">{s.name}</span>
                <div className="h-2 flex-1 rounded-full bg-surface-2">
                  <div className="h-2 rounded-full bg-ink" style={{ width: `${s.score}%` }} />
                </div>
                <span className="w-20 text-right tabular-nums text-ink-2">
                  {s.baseline} → {s.score}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="text-[15px] font-semibold">Plan</h2>
            {plan ? (
              <dl className="mt-2 space-y-1.5 text-[14px]">
                <div>
                  <dt className="text-[12px] text-muted">Primary goal</dt>
                  <dd>{plan.primaryGoalName}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-muted">Commitment</dt>
                  <dd>
                    {plan.dailyMinutes} min · {plan.frequency.replace(/_/g, " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-muted">Started</dt>
                  <dd>{plan.startDate}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-[14px] text-muted">Hasn&apos;t finished onboarding.</p>
            )}
          </Panel>

          <Panel>
            <h2 className="text-[15px] font-semibold">Roles</h2>
            <ul className="mt-3 space-y-2">
              {ROLE_KEYS.map((r) => {
                const has = user.roles.includes(r);
                const editable = manage && grantable.includes(r) && r !== "USER";
                return (
                  <li key={r} className="flex items-center justify-between gap-2 text-[14px]">
                    <span className={has ? "font-medium" : "text-muted"} title={ROLE_INFO[r].description}>
                      {ROLE_INFO[r].name}
                    </span>
                    {editable ? (
                      <ActionButton action={userRoleAction} label={has ? "Revoke" : "Grant"} hidden={{ userId: user.id, role: r, grant: has ? "0" : "1" }} tone={has ? "danger" : "default"} />
                    ) : (
                      <span className="text-[12px] text-muted">{has ? "Yes" : "—"}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          {manage && (
            <Panel>
              <h2 className="text-[15px] font-semibold">Account</h2>
              <div className="mt-3">
                {user.status === "active" ? (
                  <ActionButton
                    action={userStatusAction}
                    label="Suspend account"
                    tone="danger"
                    hidden={{ userId: user.id, status: "suspended" }}
                    confirm="Suspend this account? They'll be signed out everywhere."
                  />
                ) : (
                  <ActionButton action={userStatusAction} label="Reactivate account" hidden={{ userId: user.id, status: "active" }} />
                )}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
