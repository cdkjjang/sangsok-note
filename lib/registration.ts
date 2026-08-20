// 상속등기 비용 (상속으로 인한 취득세 + 등기 부대비용)
//
// 근거: 지방세법 제11조 제1항 제1호(상속으로 인한 취득의 세율),
//       제150조(지방교육세), 농어촌특별세법 제5조,
//       등기사항증명서 등 수수료규칙
//
// [상속 취득세는 일반 매매와 세율이 다르다]
//   매매로 집을 사면 1~3%(다주택·조정지역은 8·12%)지만, **상속은 2.8%**로
//   따로 정해져 있다. 게다가 **무주택 가구가 주택을 상속받으면 0.8%**로
//   크게 낮아진다. 부동산노트의 취득세 계산기와 세율표가 다른 이유다.
//
// [과세표준은 시가표준액]
//   매매는 실제 거래가액이 과세표준이지만, 상속은 거래가 없으므로
//   **시가표준액**(주택은 개별·공동주택가격, 토지는 개별공시지가)을 쓴다.
//   실거래가보다 낮은 것이 보통이라 세금도 그만큼 적게 나온다.
//
// [상속세와 취득세는 별개다]
//   상속세는 국세로 재산 전체에 매기고, 취득세는 지방세로 부동산 등
//   등기·등록이 필요한 재산에 매긴다. 상속세가 0원이어도 취득세는 낸다.
//   이걸 몰라 취득세 신고를 놓치는 경우가 많다.
//
// ⚠️ 이 계산기가 하지 않는 것
//   농지의 상속 취득세 감면, 1가구 1주택 감면의 세부 요건 판정,
//   지분 상속 시 지분별 안분, 법무사 보수는 다루지 않는다.
//   국민주택채권은 매입 후 즉시 매도할 때의 할인료만 어림으로 보여준다.

/** 상속으로 인한 취득세율 — 주택 외 (지방세법 제11조①1호) */
export const RATE_GENERAL = 0.028;

/** 무주택 가구가 주택을 상속받는 경우 */
export const RATE_HOUSE_NO_HOME = 0.008;

/** 지방교육세 — 취득세율에서 2%를 뺀 세율의 20% (상속은 0.16%) */
export const EDU_RATE_GENERAL = 0.0016;
/** 무주택 주택 상속의 지방교육세 */
export const EDU_RATE_HOUSE_NO_HOME = 0.0016;

/** 농어촌특별세 — 전용면적 85㎡ 초과 시 0.2% */
export const FARM_RATE = 0.002;
export const FARM_EXEMPT_AREA = 85;

/** 등기신청 수수료 (부동산 1건당) */
export const REGISTRATION_FEE_VISIT = 15_000;
export const REGISTRATION_FEE_ONLINE = 13_000;

/** 국민주택채권 매입률은 시가표준액 구간·지역에 따라 다르다.
 *  여기서는 상속등기에서 흔한 어림값만 쓰고, 실제 요율은 안내로 넘긴다. */
export const BOND_DISCOUNT_HINT = 0.08;

export type PropertyKind = "houseNoHome" | "house" | "other";

export const PROPERTY_KINDS: { key: PropertyKind; label: string; hint: string }[] = [
  {
    key: "houseNoHome",
    label: "주택 · 무주택 가구",
    hint: "상속인 가구가 주택을 갖고 있지 않은 경우 0.8%",
  },
  { key: "house", label: "주택 · 유주택", hint: "2.8%" },
  { key: "other", label: "주택 외 (토지·상가 등)", hint: "2.8%" },
];

export interface RegistrationInput {
  /** 시가표준액 (원) — 개별·공동주택가격, 개별공시지가 */
  standardValue: number;
  kind: PropertyKind;
  /** 전용면적 (㎡). 85㎡ 초과면 농어촌특별세가 붙는다 */
  areaSqm: number;
  /** 온라인(전자) 신청 여부 */
  online: boolean;
  /** 부동산 건수 */
  count: number;
}

export interface RegistrationResult {
  /** 적용 취득세율 */
  rate: number;
  /** 취득세 (원) */
  acquisitionTax: number;
  /** 지방교육세 (원) */
  educationTax: number;
  /** 농어촌특별세 (원) */
  farmTax: number;
  /** 세금 합계 (원) */
  taxTotal: number;
  /** 등기신청 수수료 (원) */
  registrationFee: number;
  /** 국민주택채권 할인료 어림 (원) */
  bondEstimate: number;
  /** 총 비용 (원) */
  total: number;
  /** 농어촌특별세 대상인지 */
  farmApplies: boolean;
}

/** 10원 미만 절사 */
export function floor10(n: number): number {
  return Math.floor(n / 10 + 1e-6) * 10;
}

export function calcRegistration(input: RegistrationInput): RegistrationResult {
  const value = Math.max(0, input.standardValue);
  const count = Math.max(1, Math.floor(input.count));

  const rate = input.kind === "houseNoHome" ? RATE_HOUSE_NO_HOME : RATE_GENERAL;
  const eduRate =
    input.kind === "houseNoHome" ? EDU_RATE_HOUSE_NO_HOME : EDU_RATE_GENERAL;

  const acquisitionTax = floor10(value * rate);
  const educationTax = floor10(value * eduRate);

  // 농어촌특별세는 주택 전용면적 85㎡ 초과에만 붙는다.
  // 주택이 아닌 부동산(토지·상가)은 면적과 무관하게 부과된다.
  const farmApplies =
    input.kind === "other" ? true : input.areaSqm > FARM_EXEMPT_AREA;
  const farmTax = farmApplies ? floor10(value * FARM_RATE) : 0;

  const taxTotal = acquisitionTax + educationTax + farmTax;
  const registrationFee =
    (input.online ? REGISTRATION_FEE_ONLINE : REGISTRATION_FEE_VISIT) * count;
  const bondEstimate = floor10(value * BOND_DISCOUNT_HINT * 0.01);

  return {
    rate,
    acquisitionTax,
    educationTax,
    farmTax,
    taxTotal,
    registrationFee,
    bondEstimate,
    total: taxTotal + registrationFee + bondEstimate,
    farmApplies,
  };
}

/** 무주택 감면으로 아끼는 금액 */
export function savingByNoHome(standardValue: number): number {
  const full = floor10(standardValue * RATE_GENERAL);
  const reduced = floor10(standardValue * RATE_HOUSE_NO_HOME);
  return full - reduced;
}
