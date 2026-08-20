"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import { calcLegalShare } from "@/lib/legal-share";
import { formatWon } from "@/lib/date";

const YES_NO = [
  { value: "yes" as const, label: "예" },
  { value: "no" as const, label: "아니오" },
];

export default function LegalShareCalculator() {
  const [estate, setEstate] = useState("70000");
  const [hasSpouse, setHasSpouse] = useState<"yes" | "no">("yes");
  const [children, setChildren] = useState("2");
  const [parents, setParents] = useState("0");
  const [siblings, setSiblings] = useState("0");

  const manwon = parseMoney(estate);
  const result = calcLegalShare({
    hasSpouse: hasSpouse === "yes",
    children: parseMoney(children) ?? 0,
    parents: parseMoney(parents) ?? 0,
    siblings: parseMoney(siblings) ?? 0,
    estate: manwon === null ? 0 : manwon * 10_000,
  });

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="나눌 상속재산"
        hint="채무를 뺀 순재산"
        unit="만원"
        value={estate}
        onChange={setEstate}
        placeholder="70000"
      />

      <OptionGroup
        label="배우자가 살아 계신가요"
        options={YES_NO}
        value={hasSpouse}
        onChange={setHasSpouse}
      />

      <MoneyField label="자녀 수" hint="1순위" unit="명" value={children} onChange={setChildren} placeholder="2" />
      <MoneyField
        label="생존한 부모·조부모 수"
        hint="2순위 — 자녀가 없을 때만 상속인이 됩니다"
        unit="명"
        value={parents}
        onChange={setParents}
        placeholder="0"
      />
      <MoneyField
        label="형제자매 수"
        hint="3순위 — 배우자·자녀·부모가 모두 없을 때만"
        unit="명"
        value={siblings}
        onChange={setSiblings}
        placeholder="0"
      />

      {result.noHeir ? (
        <p className="text-muted">
          상속인이 없습니다. 4촌 이내 방계혈족이 있으면 그들이 상속하고, 아무도
          없으면 특별연고자 청구를 거쳐 최종적으로 국고에 귀속됩니다.
        </p>
      ) : (
        <ResultCard title={result.rankLabel}>
          <ul className="space-y-3">
            {result.parts.map((p) => (
              <li key={p.label} className="border-b border-border-soft pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-bold">{p.label}</span>
                  <span className="text-lg font-extrabold text-accent-strong">
                    {formatWon(p.amountEach)}
                    {p.count > 1 && <span className="text-sm font-normal text-muted"> / 1인</span>}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  지분 {(p.ratioEach * 100).toFixed(1)}%
                  {p.count > 1 && ` · ${p.count}명 합계 ${formatWon(p.amountTotal)}`}
                  {" · 유류분 "}
                  {formatWon(p.reservedEach)}
                </p>
              </li>
            ))}
          </ul>

          {result.excluded && (
            <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
              <p className="font-bold text-accent-strong">순위에서 밀린 분들이 있습니다</p>
              <p className="mt-1.5 text-muted">{result.excluded}</p>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-border-soft p-4 text-[15px] leading-relaxed">
            <p className="font-bold">이 숫자는 기본값이지 강제가 아닙니다</p>
            <p className="mt-1.5 text-muted">
              상속인 전원이 합의하면 어떻게 나눠도 됩니다(협의분할). 유언이 있으면
              유언이 먼저입니다. 다만 유언으로도 뺏을 수 없는 최소 몫이{" "}
              <strong>유류분</strong>이고, 위에 함께 적어 두었습니다.
            </p>
          </div>
        </ResultCard>
      )}

      <p className="mt-5 text-sm leading-relaxed text-muted">
        기여분(피상속인을 특별히 부양하거나 재산 유지에 기여한 경우)과 특별수익
        (생전에 미리 받은 재산)은 반영하지 않았습니다. 실제 분할에서는 이 둘로
        몫이 달라질 수 있습니다. 다툼이 있다면 법률 전문가와 상담하세요.
      </p>
    </div>
  );
}
