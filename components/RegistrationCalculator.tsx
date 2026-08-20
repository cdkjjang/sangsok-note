"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import {
  PROPERTY_KINDS,
  calcRegistration,
  savingByNoHome,
  type PropertyKind,
} from "@/lib/registration";
import { formatWon } from "@/lib/date";

export default function RegistrationCalculator() {
  const [value, setValue] = useState("50000");
  const [kind, setKind] = useState<PropertyKind>("house");
  const [area, setArea] = useState("84");
  const [count, setCount] = useState("1");
  const [online, setOnline] = useState<"yes" | "no">("no");

  const manwon = parseMoney(value);
  const standardValue = manwon === null ? 0 : manwon * 10_000;

  const result = calcRegistration({
    standardValue,
    kind,
    areaSqm: parseMoney(area) ?? 0,
    online: online === "yes",
    count: parseMoney(count) ?? 1,
  });

  const saving = savingByNoHome(standardValue);

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="시가표준액"
        hint="실거래가가 아니라 공시가격·공시지가입니다"
        unit="만원"
        value={value}
        onChange={setValue}
        placeholder="50000"
      />

      <OptionGroup
        label="어떤 부동산인가요"
        options={PROPERTY_KINDS.map((k) => ({ value: k.key, label: k.label, hint: k.hint }))}
        value={kind}
        onChange={setKind}
      />

      {kind !== "other" && (
        <MoneyField
          label="전용면적"
          hint="85㎡를 넘으면 농어촌특별세 0.2%가 붙습니다"
          unit="㎡"
          value={area}
          onChange={setArea}
          placeholder="84"
        />
      )}

      <MoneyField label="부동산 건수" unit="건" value={count} onChange={setCount} placeholder="1" />

      <OptionGroup
        label="등기 신청 방법"
        options={[
          { value: "no" as const, label: "등기소 방문", hint: "15,000원" },
          { value: "yes" as const, label: "전자신청", hint: "13,000원" },
        ]}
        value={online}
        onChange={setOnline}
      />

      <ResultCard title="상속등기 예상 비용">
        <p className="text-3xl font-extrabold text-accent-strong">
          {formatWon(result.total)}
        </p>
        <p className="mt-1 text-[15px] text-muted">
          적용 취득세율 {(result.rate * 100).toFixed(1)}%
        </p>

        <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">취득세</dt>
            <dd>{formatWon(result.acquisitionTax)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">지방교육세 (0.16%)</dt>
            <dd>{formatWon(result.educationTax)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              농어촌특별세 (0.2%)
              {!result.farmApplies && <span className="ml-1 text-xs">85㎡ 이하 면제</span>}
            </dt>
            <dd>{formatWon(result.farmTax)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">등기신청 수수료</dt>
            <dd>{formatWon(result.registrationFee)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">국민주택채권 할인료 (어림)</dt>
            <dd>{formatWon(result.bondEstimate)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border-soft pt-2 font-bold">
            <dt>합계</dt>
            <dd>{formatWon(result.total)}</dd>
          </div>
        </dl>

        {kind === "house" && saving > 0 && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-accent-strong">
              무주택 가구라면 {formatWon(saving)}을 아낍니다
            </p>
            <p className="mt-1.5 text-muted">
              상속인 가구가 주택을 갖고 있지 않으면 세율이 2.8%에서{" "}
              <strong>0.8%</strong>로 내려갑니다. 요건에 해당하는지 관할 시·군·구청에
              확인해 보세요. 위에서 &lsquo;주택 · 무주택 가구&rsquo;를 골라 비교할 수
              있습니다.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-border-soft p-4 text-[15px] leading-relaxed">
          <p className="font-bold">상속세가 0원이어도 취득세는 냅니다</p>
          <p className="mt-1.5 text-muted">
            상속세는 국세로 재산 전체에, 취득세는 지방세로 부동산 등 등기가 필요한
            재산에 따로 매깁니다. 별개의 세금이라 상속세 대상이 아니어도 부동산을
            물려받았다면 취득세 신고를 해야 합니다. 기한은 상속개시일이 속하는 달의
            말일부터 <strong>6개월</strong>입니다.
          </p>
        </div>
      </ResultCard>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        국민주택채권 매입률은 시가표준액 구간과 지역에 따라 달라, 여기서는 즉시
        매도할 때의 할인료를 어림으로만 보여 드립니다. 실제 금액은 주택도시기금
        홈페이지에서 확인하세요. 법무사에게 맡기면 보수가 별도로 듭니다. 농지
        상속 감면과 지분 상속의 안분은 반영하지 않았습니다.
      </p>
    </div>
  );
}
