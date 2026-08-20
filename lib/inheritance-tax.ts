// 상속세 계산
//
// 근거: 상속세 및 증여세법 제18조~제30조(상속공제), 제26조(세율),
//       제69조(신고세액공제), 제20조(그 밖의 인적공제)
//
// [우리나라 상속세는 '유산세' 방식이다]
//   상속인이 각자 얼마를 받았는지가 아니라, **피상속인이 남긴 재산 전체**에
//   세율을 매긴다. 그래서 형제가 몇 명이든 세금 총액은 같고, 그 세금을
//   받은 비율대로 나눠 낸다. (독일·일본식 '유산취득세'는 각자 받은 몫에
//   과세하는 방식인데, 우리는 아직 유산세다.)
//
// [계산 순서]
//   ① 총 상속재산 = 부동산 + 금융재산 + 그 밖의 재산
//   ② 과세가액   = ① − 채무·장례비 + 사전증여재산
//   ③ 상속공제   = max(일괄공제 5억, 기초공제 2억 + 인적공제)
//                  + 배우자상속공제 + 금융재산상속공제 + 동거주택상속공제
//   ④ 과세표준   = ② − ③
//   ⑤ 산출세액   = ④ × 세율(10~50%) − 누진공제
//   ⑥ 납부세액   = ⑤ − 신고세액공제 3%
//
// [배우자가 있으면 대체로 10억까지 세금이 없다]
//   일괄공제 5억 + 배우자공제 최소 5억 = 10억. 이 구간에 드는 가구가 많아
//   "상속세는 부자만 내는 것"이라는 인식이 생겼다. 그런데 수도권 아파트
//   한 채가 10억을 넘는 경우가 흔해지면서 대상이 넓어지고 있다.
//
// ⚠️ 확정되지 않은 개편안은 넣지 않는다
//   · **유산취득세 전환** — 2028년 시행을 목표로 한 안이며 확정되지 않았다.
//   · **자녀공제 5천만원 → 5억 상향** — 국회에서 부결되어 현행이 유지된다.
//   두 가지 모두 계산에 반영하지 않는다. 통과되면 그때 반영할 것.
//
// ⚠️ 이 계산기가 하지 않는 것
//   가업상속공제·영농상속공제, 세대생략할증(30~40%), 증여세액공제,
//   단기재상속 세액공제, 비상장주식·특수관계 거래 평가는 다루지 않는다.
//   재산 평가 자체(시가 vs 기준시가)도 실무에서 다툼이 잦은 영역이라
//   이용자가 넣은 금액을 그대로 쓴다.

/** 상속세·증여세 세율 (상증세법 제26조) — 증여세와 같은 표를 쓴다 */
export interface TaxBracket {
  /** 과세표준 상한 (원). 마지막 구간은 Infinity */
  upTo: number;
  /** 세율 */
  rate: number;
  /** 누진공제액 (원) */
  deduction: number;
}

export const TAX_BRACKETS: TaxBracket[] = [
  { upTo: 100_000_000, rate: 0.1, deduction: 0 },
  { upTo: 500_000_000, rate: 0.2, deduction: 10_000_000 },
  { upTo: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
  { upTo: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { upTo: Infinity, rate: 0.5, deduction: 460_000_000 },
];

/** 기초공제 (제18조) */
export const BASIC_DEDUCTION = 200_000_000;

/** 일괄공제 (제21조) — 기초공제 + 인적공제와 비교해 큰 쪽을 택한다 */
export const LUMP_SUM_DEDUCTION = 500_000_000;

/** 자녀공제 1인당 (제20조) */
export const CHILD_DEDUCTION = 50_000_000;

/** 미성년자공제 — 1인당 연 1천만원 × 19세까지의 잔여 연수 */
export const MINOR_DEDUCTION_PER_YEAR = 10_000_000;
export const MINOR_AGE_LIMIT = 19;

/** 연로자공제 — 65세 이상 1인당 */
export const ELDERLY_DEDUCTION = 50_000_000;
export const ELDERLY_AGE = 65;

/** 장애인공제 — 1인당 연 1천만원 × 기대여명 연수 */
export const DISABLED_DEDUCTION_PER_YEAR = 10_000_000;

/** 배우자상속공제 최소액 (제19조) — 실제 상속받지 않아도 보장된다 */
export const SPOUSE_MIN_DEDUCTION = 500_000_000;

/** 배우자상속공제 한도 (제19조) */
export const SPOUSE_MAX_DEDUCTION = 3_000_000_000;

/** 금융재산상속공제 (제22조) */
export const FINANCIAL_DEDUCTION_MAX = 200_000_000;
export const FINANCIAL_DEDUCTION_RATE = 0.2;
/** 순금융재산이 이 금액 이하면 전액 공제 */
export const FINANCIAL_DEDUCTION_FULL_UNDER = 20_000_000;

/** 동거주택상속공제 (제23조의2) — 상속주택가액 100%, 한도 6억 */
export const COHABIT_HOUSE_DEDUCTION_MAX = 600_000_000;

/** 신고세액공제 (제69조) */
export const FILING_CREDIT_RATE = 0.03;

/** 신고기한 — 상속개시일이 속하는 달의 말일부터 (개월) */
export const FILING_MONTHS = 6;

/** 과세표준에 세율을 적용해 산출세액을 구한다. */
export function taxByBase(base: number): number {
  if (base <= 0) return 0;
  const b = TAX_BRACKETS.find((t) => base <= t.upTo) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return Math.max(0, Math.floor(base * b.rate - b.deduction));
}

/** 과세표준이 속한 구간을 돌려준다 (화면 표시용) */
export function bracketFor(base: number): TaxBracket {
  return TAX_BRACKETS.find((t) => base <= t.upTo) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
}

/**
 * 금융재산상속공제.
 * 순금융재산 = 금융재산 − 금융채무.
 * 2천만원 이하면 전액, 그 초과는 20%(최소 2천만원 보장), 한도 2억.
 */
export function financialDeduction(netFinancial: number): number {
  if (netFinancial <= 0) return 0;
  if (netFinancial <= FINANCIAL_DEDUCTION_FULL_UNDER) return netFinancial;
  const twenty = netFinancial * FINANCIAL_DEDUCTION_RATE;
  return Math.min(Math.max(twenty, FINANCIAL_DEDUCTION_FULL_UNDER), FINANCIAL_DEDUCTION_MAX);
}

export interface HeirInfo {
  /** 배우자 생존 여부 */
  hasSpouse: boolean;
  /** 자녀 수 */
  children: number;
  /** 미성년 자녀들의 나이 (19세 미만만) */
  minorAges: number[];
  /** 65세 이상 동거가족 수 (배우자 제외) */
  elderly: number;
  /** 장애인 수와 각자의 기대여명 연수 */
  disabledYears: number[];
}

export interface InheritanceInput {
  /** 부동산 등 그 밖의 재산 (원) */
  realEstate: number;
  /** 금융재산 (원) */
  financial: number;
  /** 금융채무 (원) */
  financialDebt: number;
  /** 그 밖의 채무 + 장례비 (원) */
  otherDebt: number;
  /** 사전증여재산 — 상속인 10년, 그 외 5년 내 증여분 (원) */
  priorGift: number;
  /** 배우자가 실제로 상속받는 금액 (원) */
  spouseShare: number;
  /** 배우자의 법정상속분 상당액 (원) — 공제 한도 계산에 쓴다 */
  spouseLegalShare: number;
  /** 동거주택 상속 가액 (원). 요건 미충족이면 0 */
  cohabitHouse: number;
  /** 기한 내 신고 여부 */
  filedInTime: boolean;
  heirs: HeirInfo;
}

export interface DeductionBreakdown {
  label: string;
  amount: number;
  note?: string;
}

export interface InheritanceResult {
  /** 총 상속재산 (원) */
  grossEstate: number;
  /** 과세가액 (원) */
  taxableEstate: number;
  /** 인적공제 합계 (기초공제 포함) */
  personalTotal: number;
  /** 일괄공제를 택했는지 */
  usedLumpSum: boolean;
  /** 배우자상속공제 (원) */
  spouseDeduction: number;
  /** 금융재산상속공제 (원) */
  financialDeductionAmount: number;
  /** 동거주택상속공제 (원) */
  cohabitDeduction: number;
  /** 공제 합계 (원) */
  totalDeduction: number;
  /** 공제 내역 */
  breakdown: DeductionBreakdown[];
  /** 과세표준 (원) */
  taxBase: number;
  /** 적용 세율 */
  rate: number;
  /** 산출세액 (원) */
  grossTax: number;
  /** 신고세액공제 (원) */
  filingCredit: number;
  /** 납부할 세액 (원) */
  finalTax: number;
  /** 세금이 나오지 않는지 */
  noTax: boolean;
  /** 실효세율 — 납부세액 ÷ 과세가액 */
  effectiveRate: number;
}

export function calcInheritanceTax(input: InheritanceInput): InheritanceResult {
  const grossEstate =
    Math.max(0, input.realEstate) + Math.max(0, input.financial);

  const taxableEstate = Math.max(
    0,
    grossEstate -
      Math.max(0, input.financialDebt) -
      Math.max(0, input.otherDebt) +
      Math.max(0, input.priorGift)
  );

  // ── 인적공제: 기초공제 + 자녀·미성년·연로자·장애인
  const h = input.heirs;
  const childTotal = Math.max(0, h.children) * CHILD_DEDUCTION;
  const minorTotal = h.minorAges
    .filter((a) => a < MINOR_AGE_LIMIT)
    .reduce((s, a) => s + (MINOR_AGE_LIMIT - a) * MINOR_DEDUCTION_PER_YEAR, 0);
  const elderlyTotal = Math.max(0, h.elderly) * ELDERLY_DEDUCTION;
  const disabledTotal = h.disabledYears.reduce(
    (s, y) => s + Math.max(0, y) * DISABLED_DEDUCTION_PER_YEAR,
    0
  );
  const personalSum =
    BASIC_DEDUCTION + childTotal + minorTotal + elderlyTotal + disabledTotal;

  // 일괄공제 5억과 비교해 큰 쪽
  const usedLumpSum = LUMP_SUM_DEDUCTION > personalSum;
  const personalTotal = usedLumpSum ? LUMP_SUM_DEDUCTION : personalSum;

  // ── 배우자상속공제
  // 실제 상속받은 금액을 기준으로 하되, 법정상속분과 30억을 넘을 수 없고,
  // 얼마를 받았든 5억은 보장된다.
  let spouseDeduction = 0;
  if (h.hasSpouse) {
    const capped = Math.min(
      Math.max(0, input.spouseShare),
      Math.max(0, input.spouseLegalShare),
      SPOUSE_MAX_DEDUCTION
    );
    spouseDeduction = Math.max(capped, SPOUSE_MIN_DEDUCTION);
  }

  // ── 금융재산상속공제
  const netFinancial = Math.max(0, input.financial) - Math.max(0, input.financialDebt);
  const financialDeductionAmount = financialDeduction(netFinancial);

  // ── 동거주택상속공제
  const cohabitDeduction = Math.min(
    Math.max(0, input.cohabitHouse),
    COHABIT_HOUSE_DEDUCTION_MAX
  );

  const totalDeduction =
    personalTotal + spouseDeduction + financialDeductionAmount + cohabitDeduction;

  const breakdown: DeductionBreakdown[] = [
    {
      label: usedLumpSum ? "일괄공제" : "기초공제 + 인적공제",
      amount: personalTotal,
      note: usedLumpSum
        ? `기초+인적공제 합계(${personalSum.toLocaleString()}원)보다 커서 일괄공제를 택했습니다`
        : `일괄공제 5억보다 커서 이쪽을 택했습니다`,
    },
  ];
  if (h.hasSpouse) {
    breakdown.push({
      label: "배우자상속공제",
      amount: spouseDeduction,
      note:
        spouseDeduction === SPOUSE_MIN_DEDUCTION
          ? "실제 상속액과 무관하게 최소 5억이 보장됩니다"
          : "실제 상속액 · 법정상속분 · 30억 중 가장 작은 값",
    });
  }
  if (financialDeductionAmount > 0) {
    breakdown.push({
      label: "금융재산상속공제",
      amount: financialDeductionAmount,
      note: "순금융재산의 20% (2천만원~2억 범위)",
    });
  }
  if (cohabitDeduction > 0) {
    breakdown.push({
      label: "동거주택상속공제",
      amount: cohabitDeduction,
      note: "10년 이상 동거 무주택 자녀가 상속받는 경우, 한도 6억",
    });
  }

  const taxBase = Math.max(0, taxableEstate - totalDeduction);
  const grossTax = taxByBase(taxBase);
  const filingCredit = input.filedInTime
    ? Math.floor(grossTax * FILING_CREDIT_RATE)
    : 0;
  const finalTax = Math.max(0, grossTax - filingCredit);

  return {
    grossEstate,
    taxableEstate,
    personalTotal,
    usedLumpSum,
    spouseDeduction,
    financialDeductionAmount,
    cohabitDeduction,
    totalDeduction,
    breakdown,
    taxBase,
    rate: bracketFor(taxBase).rate,
    grossTax,
    filingCredit,
    finalTax,
    noTax: finalTax === 0,
    effectiveRate: taxableEstate > 0 ? finalTax / taxableEstate : 0,
  };
}

/**
 * 세금이 나오기 시작하는 상속재산 규모를 역산한다.
 * "우리 집은 상속세 낼 일이 있나"에 바로 답하기 위한 것.
 */
export function taxFreeCeiling(hasSpouse: boolean): number {
  return LUMP_SUM_DEDUCTION + (hasSpouse ? SPOUSE_MIN_DEDUCTION : 0);
}
