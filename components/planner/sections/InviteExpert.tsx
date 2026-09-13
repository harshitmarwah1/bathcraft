"use client";

import { useEffect, useState } from "react";
import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useSession } from "@/lib/planner/session";
import { useProjectStore } from "@/lib/planner/store/project-store";
import { createInviteAction, listMembersAction } from "@/app/planner/actions";
import type { MemberInfo } from "@/lib/db/projects";

/** Share panel on the brief: owner mints an invite link; everyone sees who's on it. */
export function InviteExpert() {
  const { t } = useI18n();
  const { user } = useSession();
  const project = useProjectStore((s) => s.project);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const projectId = project?.id;
  const isOwner = !!user && !!project && user.id === project.ownerId;

  useEffect(() => {
    if (!projectId) return;
    let active = true;
    (async () => {
      try {
        const m = await listMembersAction(projectId);
        if (active) setMembers(m);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId]);

  async function createLink() {
    if (!projectId) return;
    setBusy(true);
    try {
      const invite = await createInviteAction(projectId);
      setLink(`${window.location.origin}/planner/join/${invite.token}`);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!project) return null;

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name="group_add" size={20} color="var(--color-primary-accent)" />
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
            {t.shareTitle}
          </h2>
          <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>
            {isOwner ? t.shareSub : t.sharedWithYou}
          </p>
        </div>
      </div>

      {isOwner &&
        (link ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 10,
                  background: "var(--color-surface-low)",
                  border: "1px solid var(--color-surface-high)",
                  color: "var(--color-on-surface)",
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={copy}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 10,
                  background: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  fontWeight: 700,
                  fontSize: 12.5,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? t.linkCopied : t.copyLink}
              </button>
            </div>
            <p style={{ fontSize: 10.5, margin: 0, color: "var(--color-on-surface-variant)" }}>{t.inviteHint}</p>
          </div>
        ) : (
          <button
            onClick={createLink}
            disabled={busy}
            style={{
              height: 44,
              borderRadius: 12,
              background: "var(--color-surface-low)",
              border: "1px solid var(--color-surface-high)",
              color: "var(--color-primary-accent)",
              fontWeight: 700,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: busy ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            <MaterialIcon name="link" size={18} color="var(--color-primary-accent)" />
            {busy ? t.creatingInvite : t.createInvite}
          </button>
        ))}

      {members.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            {t.collaborators}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {members.map((m) => (
              <span
                key={m.userId}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "var(--color-surface-container)",
                  color: "var(--color-on-surface)",
                }}
              >
                <MaterialIcon
                  name={m.role === "owner" ? "person" : "engineering"}
                  size={13}
                  color="var(--color-primary-accent)"
                />
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </StepCard>
  );
}
