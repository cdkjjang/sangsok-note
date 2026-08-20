import { describe, expect, it } from "vitest";
import {
  ACQUISITION_TAX_MONTHS,
  RENUNCIATION_MONTHS,
  TAX_FILING_MONTHS,
  TAX_FILING_MONTHS_ABROAD,
  addMonths,
  calcDeadlines,
  endOfMonth,
  mostUrgent,
  parseDate,
  type DeadlineInput,
} from "./deadline";

describe("법정 기한 고정", () => {
  it("포기·한정승인 3개월, 상속세·취득세 신고 6개월", () => {
    expect(RENUNCIATION_MONTHS).toBe(3);
    expect(TAX_FILING_MONTHS).toBe(6);
    expect(ACQUISITION_TAX_MONTHS).toBe(6);
  });
  it("국외 거주는 9개월", () => {
    expect(TAX_FILING_MONTHS_ABROAD).toBe(9);
  });
});

describe("날짜 유틸", () => {
  it("말일 보정 — 1/31에 1개월을 더하면 2월 말일", () => {
    expect(addMonths(parseDate("2026-01-31"), 1)).toEqual(parseDate("2026-02-28"));
    expect(addMonths(parseDate("2028-01-31"), 1)).toEqual(parseDate("2028-02-29"));
  });
  it("그 달의 말일", () => {
    expect(endOfMonth(parseDate("2026-02-10"))).toEqual(parseDate("2026-02-28"));
    expect(endOfMonth(parseDate("2026-03-01"))).toEqual(parseDate("2026-03-31"));
  });
});

const base: DeadlineInput = {
  deathDate: "2026-08-10",
  knownDate: "2026-08-10",
  today: "2026-08-19",
  abroad: false,
};

describe("기한 계산", () => {
  it("세 가지 기한이 날짜 순으로 나온다", () => {
    const rows = calcDeadlines(base);
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.date)).toEqual([...rows.map((r) => r.date)].sort());
  });

  it("포기·한정승인은 안 날부터 3개월", () => {
    const r = calcDeadlines(base).find((x) => x.key === "renunciation")!;
    expect(r.date).toBe("2026-11-10");
    expect(r.daysLeft).toBe(83);
  });

  it("상속세 신고는 사망한 달의 말일부터 6개월", () => {
    const r = calcDeadlines(base).find((x) => x.key === "tax")!;
    // 2026-08-31 + 6개월 = 2027-02-28 (말일 보정)
    expect(r.date).toBe("2027-02-28");
  });

  it("취득세 신고도 같은 기산점, 6개월", () => {
    const r = calcDeadlines(base).find((x) => x.key === "acquisition")!;
    expect(r.date).toBe("2027-02-28");
  });

  it("국외 거주면 상속세만 9개월로 늘어난다", () => {
    const rows = calcDeadlines({ ...base, abroad: true });
    expect(rows.find((r) => r.key === "tax")!.date).toBe("2027-05-31");
    expect(rows.find((r) => r.key === "acquisition")!.date).toBe("2027-02-28");
  });

  it("사망일과 안 날이 다르면 3개월만 뒤로 밀린다", () => {
    const rows = calcDeadlines({ ...base, knownDate: "2026-10-01" });
    expect(rows.find((r) => r.key === "renunciation")!.date).toBe("2027-01-01");
    // 세금 기한은 사망일 기준이라 그대로
    expect(rows.find((r) => r.key === "tax")!.date).toBe("2027-02-28");
  });
});

describe("긴급도", () => {
  it("14일 이내는 urgent", () => {
    const r = calcDeadlines({ ...base, today: "2026-11-01" }).find(
      (x) => x.key === "renunciation"
    )!;
    expect(r.daysLeft).toBe(9);
    expect(r.urgency).toBe("urgent");
  });

  it("30일 이내는 soon", () => {
    const r = calcDeadlines({ ...base, today: "2026-10-20" }).find(
      (x) => x.key === "renunciation"
    )!;
    expect(r.urgency).toBe("soon");
  });

  it("지나면 passed이고 남은 일수가 음수", () => {
    const r = calcDeadlines({ ...base, today: "2026-12-01" }).find(
      (x) => x.key === "renunciation"
    )!;
    expect(r.urgency).toBe("passed");
    expect(r.daysLeft).toBeLessThan(0);
  });

  it("포기 기한을 놓치면 빚까지 상속된다는 경고가 붙는다", () => {
    const r = calcDeadlines(base).find((x) => x.key === "renunciation")!;
    expect(r.consequence).toContain("단순승인");
    expect(r.consequence).toContain("빚");
  });
});

describe("가장 급한 기한", () => {
  it("남은 것 중 가장 가까운 것을 고른다", () => {
    const rows = calcDeadlines(base);
    expect(mostUrgent(rows)!.key).toBe("renunciation");
  });

  it("전부 지났으면 null", () => {
    const rows = calcDeadlines({ ...base, today: "2028-01-01" });
    expect(mostUrgent(rows)).toBeNull();
  });

  it("3개월이 지나면 그다음은 세금 기한", () => {
    const rows = calcDeadlines({ ...base, today: "2026-12-01" });
    expect(mostUrgent(rows)!.daysLeft).toBeGreaterThanOrEqual(0);
  });
});
