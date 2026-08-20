import { describe, expect, it } from "vitest";
import {
  EDU_RATE_GENERAL,
  FARM_EXEMPT_AREA,
  FARM_RATE,
  RATE_GENERAL,
  RATE_HOUSE_NO_HOME,
  calcRegistration,
  savingByNoHome,
  type RegistrationInput,
} from "./registration";

describe("세율 고정 (지방세법)", () => {
  it("상속 취득세 2.8%, 무주택 주택 상속 0.8%", () => {
    expect(RATE_GENERAL).toBe(0.028);
    expect(RATE_HOUSE_NO_HOME).toBe(0.008);
  });
  it("지방교육세 0.16%, 농어촌특별세 0.2%, 면제 기준 85㎡", () => {
    expect(EDU_RATE_GENERAL).toBe(0.0016);
    expect(FARM_RATE).toBe(0.002);
    expect(FARM_EXEMPT_AREA).toBe(85);
  });
});

const base: RegistrationInput = {
  standardValue: 500_000_000,
  kind: "house",
  areaSqm: 84,
  online: false,
  count: 1,
};

describe("상속등기 비용", () => {
  it("유주택 주택 상속 — 2.8% + 교육세", () => {
    const r = calcRegistration(base);
    expect(r.rate).toBe(0.028);
    expect(r.acquisitionTax).toBe(14_000_000);
    expect(r.educationTax).toBe(800_000);
    // 84㎡라 농어촌특별세 없음
    expect(r.farmApplies).toBe(false);
    expect(r.farmTax).toBe(0);
    expect(r.taxTotal).toBe(14_800_000);
  });

  it("무주택 가구가 주택을 상속받으면 0.8%", () => {
    const r = calcRegistration({ ...base, kind: "houseNoHome" });
    expect(r.rate).toBe(0.008);
    expect(r.acquisitionTax).toBe(4_000_000);
  });

  it("무주택 감면으로 아끼는 금액", () => {
    expect(savingByNoHome(500_000_000)).toBe(10_000_000);
    const full = calcRegistration(base).acquisitionTax;
    const reduced = calcRegistration({ ...base, kind: "houseNoHome" }).acquisitionTax;
    expect(full - reduced).toBe(savingByNoHome(500_000_000));
  });

  it("85㎡를 넘으면 농어촌특별세가 붙는다", () => {
    const r = calcRegistration({ ...base, areaSqm: 85.1 });
    expect(r.farmApplies).toBe(true);
    expect(r.farmTax).toBe(1_000_000);
    expect(r.taxTotal).toBe(15_800_000);
  });

  it("85㎡ 정확히는 면제", () => {
    expect(calcRegistration({ ...base, areaSqm: 85 }).farmApplies).toBe(false);
  });

  it("주택이 아닌 부동산은 면적과 무관하게 농특세 대상", () => {
    const r = calcRegistration({ ...base, kind: "other", areaSqm: 30 });
    expect(r.farmApplies).toBe(true);
    expect(r.farmTax).toBe(1_000_000);
  });

  it("등기 수수료는 건수만큼, 온라인이 더 싸다", () => {
    expect(calcRegistration({ ...base, count: 3 }).registrationFee).toBe(45_000);
    expect(calcRegistration({ ...base, count: 3, online: true }).registrationFee).toBe(39_000);
  });

  it("총 비용은 세금 + 수수료 + 채권 할인료", () => {
    const r = calcRegistration(base);
    expect(r.total).toBe(r.taxTotal + r.registrationFee + r.bondEstimate);
  });

  it("시가표준액이 0이면 세금도 0", () => {
    const r = calcRegistration({ ...base, standardValue: 0 });
    expect(r.taxTotal).toBe(0);
    // 등기 수수료는 남는다
    expect(r.registrationFee).toBe(15_000);
  });

  it("건수는 최소 1로 본다", () => {
    expect(calcRegistration({ ...base, count: 0 }).registrationFee).toBe(15_000);
  });
});
