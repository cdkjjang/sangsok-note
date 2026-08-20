"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import { calcInheritanceTax, taxFreeCeiling } from "@/lib/inheritance-tax";
import { formatKoreanWon, formatWon } from "@/lib/date";

const YES_NO = [
  { value: "yes" as const, label: "예" },
  { value: "no" as const, label: "아니오" },
];

/** 만원 단위 입력을 원으로. 비어 있으면 0 */
function won(v: string): number {
  const n = parseMoney(v);
  return n === null ? 0 : n * 10_000;
}

export default function InheritanceTaxCalculator() {
  const [realEstate, setRealEstate] = useState("80000");
  const [financial, setFinancial] = useState("20000");
  const [financialDebt, setFinancialDebt] = useState("0");
  const [otherDebt, setOtherDebt] = useState("0");
  const [priorGift, setPriorGift] = useState("0");
  const [hasSpouse, setHasSpouse] = useState<"yes" | "no">("yes");
  const [children, setChildren] = useState("2");
  const [spouseShare, setSpouseShare] = useState("0");
  const [cohabitHouse, setCohabitHouse] = useState("0");
  const [filedInTime, setFiledInTime] = useState<"yes" | "no">("yes");

  const childCount = parseMoney(children) ?? 0;
  const spouse = hasSpouse === "yes";

  // 배우자의 법정상속분 상당액 — 배우자 1.5 : 자녀 각 1
  const estateForShare =
    won(realEstate) + won(financial) - won(financialDebt) - won(otherDebt);
  const units = (spouse ? 1.5 : 0) + childCount;
  const spouseLegalShare =
    spouse && units > 0 ? Math.max(0, estateForShare) * (1.5 / units) : 0;

  const result = calcInheritanceTax({
    realEstate: won(realEstate),
    financial: won(financial),
    financialDebt: won(financialDebt),
    otherDebt: won(otherDebt),
    priorGift: won(priorGift),
    spouseShare: won(spouseShare),
    spouseLegalShare,
    cohabitHouse: won(cohabitHouse),
    filedInTime: filedInTime === "yes",
    heirs: {
      hasSpouse: spouse,
      children: childCount,
      minorAges: [],
      elderly: 0,
      disabledYears: [],
    },
  });

  const ceiling = taxFreeCeiling(spouse);

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="부동산 등 그 밖의 재산"
        hint="아파트·토지·자동차 등. 시가 기준"
        unit="만원"
        value={realEstate}
        onChange={setRealEstate}
        placeholder="80000"
      />
      <MoneyField
        label="금융재산"
        hint="예금·주식·보험금 등"
        unit="만원"
        value={financial}
        onChange={setFinancial}
        placeholder="20000"
      />
      <MoneyField
        label="금융채무"
        hint="대출 등"
        unit="만원"
        value={financialDebt}
        onChange={setFinancialDebt}
        placeholder="0"
      />
      <MoneyField
        label="그 밖의 채무 + 장례비"
        hint="장례비는 증빙 있으면 최대 1천만원(봉안시설 별도)"
        unit="만원"
        value={otherDebt}
        onChange={setOtherDebt}
        placeholder="0"
      />
      <MoneyField
        label="사전증여재산"
        hint="상속인에게 10년, 그 외에 5년 이내 증여한 것"
        unit="만원"
        value={priorGift}
        onChange={setPriorGift}
        placeholder="0"
      />

      <OptionGroup
        label="배우자가 살아 계신가요"
        options={YES_NO}
        value={hasSpouse}
        onChange={setHasSpouse}
      />

      <MoneyField
        label="자녀 수"
        unit="명"
        value={children}
        onChange={setChildren}
        placeholder="2"
      />

      {spouse && (
        <MoneyField
          label="배우자가 실제로 상속받는 금액"
          hint="협의분할 결과. 모르면 0으로 두세요 — 최소 5억은 공제됩니다"
          unit="만원"
          value={spouseShare}
          onChange={setSpouseShare}
          placeholder="0"
        />
      )}

      <MoneyField
        label="동거주택 상속가액"
        hint="10년 이상 함께 산 무주택 자녀가 받는 주택만. 아니면 0"
        unit="만원"
        value={cohabitHouse}
        onChange={setCohabitHouse}
        placeholder="0"
      />

      <OptionGroup
        label="6개월 신고기한을 지킬 예정인가요"
        options={YES_NO}
        value={filedInTime}
        onChange={setFiledInTime}
      />

      <ResultCard title={result.noTax ? "상속세가 나오지 않습니다" : "예상 상속세"}>
        {result.noTax ? (
          <>
            <p className="text-2xl font-extrabold text-accent-strong">0원</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              공제 합계({formatKoreanWon(result.totalDeduction)})가 과세가액
              ({formatKoreanWon(result.taxableEstate)})보다 커서 과세표준이 0입니다.
              {" "}
              <strong>
                {spouse
                  ? "배우자가 계시면 대체로 10억까지는 세금이 없습니다."
                  : "배우자가 안 계시면 공제가 5억뿐이라 문턱이 절반으로 내려갑니다."}
              </strong>
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-extrabold text-accent-strong">
              {formatWon(result.finalTax)}
            </p>
            <p className="mt-1 text-[15px] text-muted">
              과세표준 {formatKoreanWon(result.taxBase)} · 적용세율{" "}
              {Math.round(result.rate * 100)}% · 실효세율{" "}
              {(result.effectiveRate * 100).toFixed(1)}%
            </p>
          </>
        )}

        <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">총 상속재산</dt>
            <dd>{formatWon(result.grossEstate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">과세가액 (채무·장례비 차감, 사전증여 가산)</dt>
            <dd>{formatWon(result.taxableEstate)}</dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-border-soft pt-4">
          <p className="mb-2 font-bold">공제 내역</p>
          <ul className="space-y-2.5 text-[15px]">
            {result.breakdown.map((b) => (
              <li key={b.label} className="flex justify-between gap-4">
                <span>
                  <span className="font-semibold">{b.label}</span>
                  {b.note && (
                    <span className="mt-0.5 block text-sm text-muted">{b.note}</span>
                  )}
                </span>
                <span className="shrink-0">−{formatWon(b.amount)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between gap-4 border-t border-border-soft pt-3 font-bold">
            <span>공제 합계</span>
            <span>−{formatWon(result.totalDeduction)}</span>
          </p>
        </div>

        {!result.noTax && (
          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">산출세액</dt>
              <dd>{formatWon(result.grossTax)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">신고세액공제 3%</dt>
              <dd>
                {result.filingCredit > 0 ? `−${formatWon(result.filingCredit)}` : "0원"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 font-bold">
              <dt>납부할 세액</dt>
              <dd>{formatWon(result.finalTax)}</dd>
            </div>
          </dl>
        )}

        {!result.noTax && filedInTime === "no" && (
          <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-rose-600 dark:text-rose-400">
              기한을 넘기면 3% 공제도 사라지고 가산세가 붙습니다
            </p>
            <p className="mt-1.5 text-muted">
              신고만 제때 해도 {formatWon(Math.floor(result.grossTax * 0.03))}을
              아낍니다. 반대로 무신고면 가산세 20%(부정행위 40%)에 납부지연가산세가
              더해집니다. 낼 돈이 없어도 <strong>신고는 먼저 하세요.</strong>
            </p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
          <p className="font-bold text-accent-strong">
            {spouse ? "배우자가 계시면" : "배우자가 안 계시면"} 대략{" "}
            {formatKoreanWon(ceiling)}부터 세금이 시작됩니다
          </p>
          <p className="mt-1.5 text-muted">
            일괄공제 5억{spouse && " + 배우자공제 최소 5억"}이 기본으로 깔리기
            때문입니다. 여기에 금융재산·동거주택 공제가 더해지면 문턱이 더
            올라갑니다.
          </p>
        </div>
      </ResultCard>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        가업상속공제·영농상속공제, 세대생략할증(30~40%), 증여세액공제, 단기재상속
        세액공제는 반영하지 않았습니다. 재산 평가(시가 vs 기준시가)는 입력한
        금액을 그대로 씁니다. <strong>세무 자문이 아니며</strong>, 실제 신고는
        국세청 홈택스와 세무 전문가를 통해 확인하세요.
      </p>
    </div>
  );
}
