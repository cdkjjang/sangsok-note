import { describe, expect, it } from "vitest";
import {
  RESERVED_SHARE,
  SPOUSE_RATIO,
  calcLegalShare,
  type ShareInput,
} from "./legal-share";

describe("법정 지분 고정", () => {
  it("배우자는 다른 상속인의 1.5배", () => {
    expect(SPOUSE_RATIO).toBe(1.5);
  });
  it("유류분 — 직계비속·배우자 1/2, 직계존속·형제자매 1/3", () => {
    expect(RESERVED_SHARE.descendantOrSpouse).toBe(0.5);
    expect(RESERVED_SHARE.ascendantOrSibling).toBeCloseTo(1 / 3, 10);
  });
});

const base: ShareInput = {
  hasSpouse: true,
  children: 2,
  parents: 0,
  siblings: 0,
  estate: 700_000_000,
};

describe("1순위 — 배우자와 자녀", () => {
  it("배우자 1.5 : 자녀 1 : 자녀 1 = 3 : 2 : 2", () => {
    const r = calcLegalShare(base);
    expect(r.rank).toBe(1);
    const spouse = r.parts.find((p) => p.type === "spouse")!;
    const child = r.parts.find((p) => p.type === "child")!;
    expect(spouse.ratioEach).toBeCloseTo(3 / 7, 10);
    expect(child.ratioEach).toBeCloseTo(2 / 7, 10);
    // 7억을 3:2:2로 → 3억 / 2억 / 2억
    expect(spouse.amountEach).toBe(300_000_000);
    expect(child.amountEach).toBe(200_000_000);
    expect(child.amountTotal).toBe(400_000_000);
  });

  it("자녀는 몇 명이든 균등하다 — 장남·딸·기혼 구분 없음", () => {
    const r = calcLegalShare({ ...base, children: 4, estate: 1_100_000_000 });
    const child = r.parts.find((p) => p.type === "child")!;
    // 1.5 : 1 : 1 : 1 : 1 = 5.5분의 1
    expect(child.ratioEach).toBeCloseTo(1 / 5.5, 10);
    expect(child.count).toBe(4);
  });

  it("배우자가 없으면 자녀끼리 균등", () => {
    const r = calcLegalShare({ ...base, hasSpouse: false, estate: 600_000_000 });
    expect(r.parts).toHaveLength(1);
    expect(r.parts[0].amountEach).toBe(300_000_000);
  });

  it("자녀가 있으면 부모·형제는 상속인이 아니다", () => {
    const r = calcLegalShare({ ...base, parents: 2, siblings: 3 });
    expect(r.parts.map((p) => p.type)).toEqual(["spouse", "child"]);
    expect(r.excluded).toContain("자녀가 있으므로");
  });

  it("자녀의 유류분은 법정상속분의 1/2", () => {
    const r = calcLegalShare(base);
    const child = r.parts.find((p) => p.type === "child")!;
    expect(child.reservedEach).toBe(100_000_000);
  });
});

describe("2순위 — 배우자와 직계존속", () => {
  it("자녀가 없으면 부모가 배우자와 함께 상속한다", () => {
    const r = calcLegalShare({
      hasSpouse: true,
      children: 0,
      parents: 2,
      siblings: 0,
      estate: 700_000_000,
    });
    expect(r.rank).toBe(2);
    const spouse = r.parts.find((p) => p.type === "spouse")!;
    const parent = r.parts.find((p) => p.type === "parent")!;
    expect(spouse.ratioEach).toBeCloseTo(3 / 7, 10);
    expect(parent.ratioEach).toBeCloseTo(2 / 7, 10);
  });

  it("직계존속의 유류분은 1/3", () => {
    const r = calcLegalShare({
      hasSpouse: false,
      children: 0,
      parents: 1,
      siblings: 0,
      estate: 300_000_000,
    });
    const parent = r.parts.find((p) => p.type === "parent")!;
    expect(parent.amountEach).toBe(300_000_000);
    expect(parent.reservedEach).toBe(100_000_000);
  });
});

describe("배우자 단독상속 — 가장 오해가 많은 경우", () => {
  it("자녀도 부모도 없으면 형제자매가 있어도 배우자가 전부 받는다", () => {
    const r = calcLegalShare({
      hasSpouse: true,
      children: 0,
      parents: 0,
      siblings: 3,
      estate: 500_000_000,
    });
    expect(r.parts).toHaveLength(1);
    expect(r.parts[0].type).toBe("spouse");
    expect(r.parts[0].amountEach).toBe(500_000_000);
    expect(r.excluded).toContain("형제자매는 상속인이 되지 않습니다");
  });
});

describe("3순위 — 형제자매", () => {
  it("배우자도 자녀도 부모도 없을 때만 형제자매가 상속한다", () => {
    const r = calcLegalShare({
      hasSpouse: false,
      children: 0,
      parents: 0,
      siblings: 4,
      estate: 400_000_000,
    });
    expect(r.rank).toBe(3);
    expect(r.parts[0].amountEach).toBe(100_000_000);
    // 형제자매 유류분은 1/3
    expect(r.parts[0].reservedEach).toBe(33_333_333);
  });
});

describe("경계", () => {
  it("상속인이 아무도 없으면 빈 결과", () => {
    const r = calcLegalShare({
      hasSpouse: false,
      children: 0,
      parents: 0,
      siblings: 0,
      estate: 100_000_000,
    });
    expect(r.noHeir).toBe(true);
    expect(r.parts).toHaveLength(0);
  });

  it("재산이 0이면 각자 몫도 0", () => {
    const r = calcLegalShare({ ...base, estate: 0 });
    expect(r.parts.every((p) => p.amountEach === 0)).toBe(true);
  });

  it("음수 입력은 0으로 처리한다", () => {
    const r = calcLegalShare({ ...base, children: -1, estate: -100 });
    expect(r.noHeir).toBe(false);
    expect(r.parts[0].amountEach).toBe(0);
  });
});
