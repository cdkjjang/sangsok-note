import { describe, expect, it } from "vitest";
import {
  BASIC_DEDUCTION,
  CHILD_DEDUCTION,
  COHABIT_HOUSE_DEDUCTION_MAX,
  FILING_CREDIT_RATE,
  FINANCIAL_DEDUCTION_MAX,
  LUMP_SUM_DEDUCTION,
  SPOUSE_MAX_DEDUCTION,
  SPOUSE_MIN_DEDUCTION,
  TAX_BRACKETS,
  calcInheritanceTax,
  financialDeduction,
  taxByBase,
  taxFreeCeiling,
  type InheritanceInput,
} from "./inheritance-tax";

// ─────────────────────────────────────────────────────────────
// 고시값 고정 테스트
//
// 상수를 기호로만 참조하면 값이 낡아도 전부 통과한다. 워크스페이스의 다른
// 노트에서 실제로 그 사고가 났다. 여기서는 숫자를 리터럴로 박아 두어
// 세법이 개정되면 이 블록이 먼저 깨지게 한다.
// ─────────────────────────────────────────────────────────────
describe("현행 세법 고정 (2026년)", () => {
  it("세율 5구간 10·20·30·40·50%와 누진공제", () => {
    expect(TAX_BRACKETS).toEqual([
      { upTo: 100_000_000, rate: 0.1, deduction: 0 },
      { upTo: 500_000_000, rate: 0.2, deduction: 10_000_000 },
      { upTo: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
      { upTo: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
      { upTo: Infinity, rate: 0.5, deduction: 460_000_000 },
    ]);
  });

  it("기초공제 2억 · 일괄공제 5억 · 자녀공제 5천만원", () => {
    expect(BASIC_DEDUCTION).toBe(200_000_000);
    expect(LUMP_SUM_DEDUCTION).toBe(500_000_000);
    // ⚠️ 자녀공제 5억 상향안은 국회에서 부결됐다. 현행 5천만원을 유지한다.
    expect(CHILD_DEDUCTION).toBe(50_000_000);
  });

  it("배우자상속공제 최소 5억 · 한도 30억", () => {
    expect(SPOUSE_MIN_DEDUCTION).toBe(500_000_000);
    expect(SPOUSE_MAX_DEDUCTION).toBe(3_000_000_000);
  });

  it("금융재산상속공제 한도 2억 · 동거주택 6억 · 신고세액공제 3%", () => {
    expect(FINANCIAL_DEDUCTION_MAX).toBe(200_000_000);
    expect(COHABIT_HOUSE_DEDUCTION_MAX).toBe(600_000_000);
    expect(FILING_CREDIT_RATE).toBe(0.03);
  });
});

describe("세율 적용", () => {
  it("구간별 산출세액", () => {
    expect(taxByBase(100_000_000)).toBe(10_000_000);
    expect(taxByBase(500_000_000)).toBe(90_000_000);
    expect(taxByBase(1_000_000_000)).toBe(240_000_000);
    expect(taxByBase(3_000_000_000)).toBe(1_040_000_000);
  });

  it("구간 경계에서 세액이 튀지 않는다 — 누진공제가 하는 일", () => {
    expect(taxByBase(100_000_001)).toBe(taxByBase(100_000_000));
    expect(taxByBase(500_000_001)).toBe(taxByBase(500_000_000));
    expect(taxByBase(3_000_000_001)).toBe(taxByBase(3_000_000_000));
  });

  it("과세표준이 0 이하면 세금이 없다", () => {
    expect(taxByBase(0)).toBe(0);
    expect(taxByBase(-1)).toBe(0);
  });
});

describe("금융재산상속공제", () => {
  it("2천만원 이하는 전액", () => {
    expect(financialDeduction(10_000_000)).toBe(10_000_000);
    expect(financialDeduction(20_000_000)).toBe(20_000_000);
  });

  it("2천만원 초과는 20%를 주되 2천만원은 보장한다", () => {
    expect(financialDeduction(30_000_000)).toBe(20_000_000);
    expect(financialDeduction(100_000_000)).toBe(20_000_000);
    expect(financialDeduction(200_000_000)).toBe(40_000_000);
  });

  it("한도는 2억", () => {
    expect(financialDeduction(1_000_000_000)).toBe(200_000_000);
    expect(financialDeduction(5_000_000_000)).toBe(200_000_000);
  });

  it("순금융재산이 없으면 0", () => {
    expect(financialDeduction(0)).toBe(0);
    expect(financialDeduction(-5_000_000)).toBe(0);
  });
});

const base: InheritanceInput = {
  realEstate: 800_000_000,
  financial: 200_000_000,
  financialDebt: 0,
  otherDebt: 0,
  priorGift: 0,
  spouseShare: 0,
  spouseLegalShare: 0,
  cohabitHouse: 0,
  filedInTime: true,
  heirs: { hasSpouse: true, children: 2, minorAges: [], elderly: 0, disabledYears: [] },
};

describe("상속세 계산", () => {
  it("배우자 있고 재산 10억이면 세금이 없다 — 가장 흔한 경우", () => {
    const r = calcInheritanceTax(base);
    expect(r.grossEstate).toBe(1_000_000_000);
    expect(r.usedLumpSum).toBe(true);
    expect(r.personalTotal).toBe(500_000_000);
    expect(r.spouseDeduction).toBe(500_000_000);
    expect(r.financialDeductionAmount).toBe(40_000_000);
    expect(r.taxBase).toBe(0);
    expect(r.finalTax).toBe(0);
    expect(r.noTax).toBe(true);
  });

  it("배우자가 없으면 공제가 5억뿐이라 세금이 확 늘어난다", () => {
    const r = calcInheritanceTax({
      ...base,
      realEstate: 1_500_000_000,
      financial: 0,
      heirs: { ...base.heirs, hasSpouse: false },
    });
    expect(r.totalDeduction).toBe(500_000_000);
    expect(r.taxBase).toBe(1_000_000_000);
    // 10억 × 30% − 6천만 = 2.4억
    expect(r.grossTax).toBe(240_000_000);
    expect(r.filingCredit).toBe(7_200_000);
    expect(r.finalTax).toBe(232_800_000);
  });

  it("신고를 늦게 하면 3% 공제를 못 받는다", () => {
    const late = calcInheritanceTax({
      ...base,
      realEstate: 1_500_000_000,
      financial: 0,
      filedInTime: false,
      heirs: { ...base.heirs, hasSpouse: false },
    });
    expect(late.filingCredit).toBe(0);
    expect(late.finalTax).toBe(240_000_000);
    expect(late.finalTax - 232_800_000).toBe(7_200_000);
  });

  it("채무와 장례비는 과세가액에서 뺀다", () => {
    const r = calcInheritanceTax({ ...base, otherDebt: 300_000_000 });
    expect(r.taxableEstate).toBe(700_000_000);
  });

  it("사전증여재산은 다시 더한다", () => {
    const r = calcInheritanceTax({ ...base, priorGift: 200_000_000 });
    expect(r.taxableEstate).toBe(1_200_000_000);
  });

  it("배우자공제는 실제 상속액·법정상속분·30억 중 가장 작은 값", () => {
    const r = calcInheritanceTax({
      ...base,
      realEstate: 5_000_000_000,
      spouseShare: 2_000_000_000,
      spouseLegalShare: 1_500_000_000,
    });
    expect(r.spouseDeduction).toBe(1_500_000_000);
  });

  it("배우자공제는 30억을 넘지 못한다", () => {
    const r = calcInheritanceTax({
      ...base,
      realEstate: 10_000_000_000,
      spouseShare: 4_000_000_000,
      spouseLegalShare: 5_000_000_000,
    });
    expect(r.spouseDeduction).toBe(SPOUSE_MAX_DEDUCTION);
  });

  it("배우자가 한 푼도 안 받아도 5억은 공제된다", () => {
    const r = calcInheritanceTax({ ...base, spouseShare: 0, spouseLegalShare: 0 });
    expect(r.spouseDeduction).toBe(500_000_000);
  });

  it("자녀가 많고 미성년이면 인적공제가 일괄공제를 넘어선다", () => {
    const r = calcInheritanceTax({
      ...base,
      realEstate: 3_000_000_000,
      heirs: {
        hasSpouse: true,
        children: 5,
        minorAges: [5, 7, 9],
        elderly: 0,
        disabledYears: [],
      },
    });
    // 기초 2억 + 자녀 5×5천만 2.5억 + 미성년 (14+12+10)년 ×1천만 3.6억 = 8.1억
    expect(r.usedLumpSum).toBe(false);
    expect(r.personalTotal).toBe(810_000_000);
  });

  it("동거주택상속공제는 6억이 한도", () => {
    const r = calcInheritanceTax({ ...base, cohabitHouse: 900_000_000 });
    expect(r.cohabitDeduction).toBe(600_000_000);
  });

  it("공제 내역이 항목별로 나온다", () => {
    const r = calcInheritanceTax({ ...base, cohabitHouse: 300_000_000 });
    const labels = r.breakdown.map((b) => b.label);
    expect(labels).toContain("일괄공제");
    expect(labels).toContain("배우자상속공제");
    expect(labels).toContain("금융재산상속공제");
    expect(labels).toContain("동거주택상속공제");
  });

  it("실효세율은 과세가액 대비로 계산한다", () => {
    const r = calcInheritanceTax({
      ...base,
      realEstate: 3_000_000_000,
      financial: 0,
      heirs: { ...base.heirs, hasSpouse: false },
    });
    expect(r.effectiveRate).toBeCloseTo(r.finalTax / r.taxableEstate, 10);
    // 명목 최고세율보다 실효세율이 한참 낮다
    expect(r.effectiveRate).toBeLessThan(r.rate);
  });

  it("재산이 0이어도 음수가 되지 않는다", () => {
    const r = calcInheritanceTax({ ...base, realEstate: 0, financial: 0 });
    expect(r.taxableEstate).toBe(0);
    expect(r.finalTax).toBe(0);
  });
});

describe("세금이 시작되는 지점", () => {
  it("배우자가 있으면 10억, 없으면 5억", () => {
    expect(taxFreeCeiling(true)).toBe(1_000_000_000);
    expect(taxFreeCeiling(false)).toBe(500_000_000);
  });

  it("배우자 있는 가구는 10억까지 세금이 없다", () => {
    const under = calcInheritanceTax({ ...base, realEstate: 1_000_000_000, financial: 0 });
    expect(under.finalTax).toBe(0);
  });

  it("배우자 없는 가구는 5억을 넘으면 세금이 붙기 시작한다", () => {
    const solo = { ...base, financial: 0, heirs: { ...base.heirs, hasSpouse: false } };
    expect(calcInheritanceTax({ ...solo, realEstate: 500_000_000 }).finalTax).toBe(0);
    expect(calcInheritanceTax({ ...solo, realEstate: 600_000_000 }).finalTax).toBeGreaterThan(0);
  });
});
