"use client";

import { useState } from "react";
import { DateField, ResultCard } from "./fields";
import OptionGroup from "./OptionGroup";
import { calcDeadlines, mostUrgent, type Urgency } from "@/lib/deadline";

const STYLE: Record<Urgency, { border: string; text: string; badge: string }> = {
  passed: {
    border: "border-rose-400/50 bg-rose-500/5",
    text: "text-rose-600 dark:text-rose-400",
    badge: "지남",
  },
  urgent: {
    border: "border-rose-400/50 bg-rose-500/5",
    text: "text-rose-600 dark:text-rose-400",
    badge: "임박",
  },
  soon: {
    border: "border-amber-400/50 bg-amber-500/5",
    text: "text-amber-600 dark:text-amber-400",
    badge: "주의",
  },
  safe: {
    border: "border-border-soft",
    text: "text-accent-strong",
    badge: "여유",
  },
};

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DeadlineCalculator() {
  const [deathDate, setDeathDate] = useState("");
  const [sameDay, setSameDay] = useState<"yes" | "no">("yes");
  const [knownDate, setKnownDate] = useState("");
  const [abroad, setAbroad] = useState<"yes" | "no">("no");

  const today = todayISO();
  const known = sameDay === "yes" ? deathDate : knownDate || deathDate;

  const rows = deathDate ? calcDeadlines({ deathDate, knownDate: known, today, abroad: abroad === "yes" }) : [];
  const urgent = rows.length ? mostUrgent(rows) : null;

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <DateField label="상속개시일 (돌아가신 날)" value={deathDate} onChange={setDeathDate} />

      <OptionGroup
        label="돌아가신 사실을 그날 바로 아셨나요"
        options={[
          { value: "yes" as const, label: "예" },
          { value: "no" as const, label: "아니오", hint: "나중에 알게 됨" },
        ]}
        value={sameDay}
        onChange={setSameDay}
      />
      {sameDay === "no" && (
        <DateField
          label="상속개시를 안 날"
          hint="포기·한정승인 3개월은 이 날부터 셉니다"
          value={knownDate}
          onChange={setKnownDate}
        />
      )}

      <OptionGroup
        label="상속인 전원이 국외에 거주하거나 피상속인이 비거주자인가요"
        options={[
          { value: "no" as const, label: "아니오" },
          { value: "yes" as const, label: "예", hint: "신고기한 9개월" },
        ]}
        value={abroad}
        onChange={setAbroad}
      />

      {rows.length === 0 ? (
        <p className="text-muted">상속개시일을 넣으면 기한이 나옵니다.</p>
      ) : (
        <ResultCard
          title={
            urgent
              ? `가장 급한 것 — ${urgent.label} (${urgent.daysLeft}일 남음)`
              : "모든 기한이 지났습니다"
          }
        >
          <ul className="space-y-3">
            {rows.map((r) => {
              const s = STYLE[r.urgency];
              return (
                <li key={r.key} className={`rounded-xl border p-4 ${s.border}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-bold">{r.label}</span>
                    <span className={`text-lg font-extrabold ${s.text}`}>
                      {r.daysLeft >= 0 ? `D-${r.daysLeft}` : `${-r.daysLeft}일 지남`}
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] font-semibold">{r.date}</p>
                  <p className="mt-1 text-sm text-muted">{r.basis}</p>
                  <p className={`mt-2 text-sm ${r.urgency === "passed" || r.urgency === "urgent" ? s.text : "text-muted"}`}>
                    {r.consequence}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-accent-strong">
              3개월은 &ldquo;아무것도 안 하면&rdquo; 자동으로 빚까지 받게 되는 기한입니다
            </p>
            <p className="mt-1.5 text-muted">
              다른 기한은 늦으면 가산세로 끝나지만, 이건 다릅니다. 3개월 안에
              포기나 한정승인을 하지 않으면 <strong>단순승인한 것으로 봅니다.</strong>{" "}
              재산보다 빚이 많아도 그대로 떠안습니다. 재산 상태가 불확실하다면
              일단 한정승인을 검토하세요.
            </p>
          </div>
        </ResultCard>
      )}

      <p className="mt-5 text-sm leading-relaxed text-muted">
        기한 마지막 날이 토·일요일이나 공휴일이면 그다음 근무일로 밀립니다.
        3개월이 지난 뒤에 빚을 알게 된 경우에는 중대한 과실이 없었다면 그 사실을
        안 날부터 3개월 안에 <strong>특별한정승인</strong>을 할 수 있습니다.
        기한을 넘겼다고 바로 포기하지 말고 법률 상담을 받아 보세요.
      </p>
    </div>
  );
}
