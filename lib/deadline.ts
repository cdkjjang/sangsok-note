// 상속 기한 D-day
//
// 근거: 민법 제1019조(승인·포기의 기간), 제1030조(한정승인의 방식),
//       상속세 및 증여세법 제67조(상속세 과세표준신고),
//       지방세법 제20조(취득의 시기 등)
//
// [상속에서 시계는 두 번 돌아간다]
//   ① **3개월** — 상속포기·한정승인. 상속개시를 안 날부터.
//      이 기간이 지나면 **단순승인한 것으로 본다.** 즉 빚까지 전부 떠안는다.
//      아무것도 하지 않는 것이 곧 "빚을 받겠다"는 의사표시가 되는 구조라
//      상속에서 가장 위험한 기한이다.
//   ② **6개월** — 상속세 신고·납부. 상속개시일이 속하는 달의 말일부터.
//      상속 취득세 신고도 같은 기한이다.
//
// [3개월 기산점은 '사망일'이 아니라 '안 날']
//   민법은 "상속개시 있음을 안 날"부터로 정한다. 보통은 사망일과 같지만,
//   연락이 끊긴 가족이라면 나중에 알게 된 날이 기산점이 된다.
//   이 계산기는 사망일과 인지일을 따로 받는다.
//
// [특별한정승인]
//   3개월이 지난 뒤에야 빚이 더 많다는 사실을 알게 된 경우, 중대한 과실이
//   없었다면 그 사실을 안 날부터 3개월 안에 한정승인할 수 있다(제1019조 제3항).
//   기한을 놓쳤다고 무조건 끝은 아니라는 뜻이지만, '중대한 과실 없음'을
//   본인이 증명해야 해서 쉽지는 않다.

/** 상속포기·한정승인 기한 (개월) — 상속개시를 안 날부터 */
export const RENUNCIATION_MONTHS = 3;

/** 상속세 신고 기한 (개월) — 상속개시일이 속하는 달의 말일부터 */
export const TAX_FILING_MONTHS = 6;

/** 상속 취득세 신고 기한 (개월) — 상속개시일이 속하는 달의 말일부터 */
export const ACQUISITION_TAX_MONTHS = 6;

/** 피상속인이 비거주자이거나 상속인 전원이 국외 거주면 신고기한이 9개월 */
export const TAX_FILING_MONTHS_ABROAD = 9;

export function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 개월 더하기 — 말일 보정 (1/31 + 1개월 = 2월 말일) */
export function addMonths(d: Date, months: number): Date {
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target;
}

/** 그 달의 말일 */
export function endOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
}

export function diffDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export type Urgency = "safe" | "soon" | "urgent" | "passed";

export interface Deadline {
  key: string;
  label: string;
  /** 마감일 (YYYY-MM-DD) */
  date: string;
  /** 남은 일수. 지났으면 음수 */
  daysLeft: number;
  urgency: Urgency;
  /** 기산점 설명 */
  basis: string;
  /** 놓치면 어떻게 되는지 */
  consequence: string;
}

export interface DeadlineInput {
  /** 상속개시일 = 사망일 (YYYY-MM-DD) */
  deathDate: string;
  /** 상속개시를 안 날 (YYYY-MM-DD). 보통 사망일과 같다 */
  knownDate: string;
  /** 오늘 (YYYY-MM-DD) */
  today: string;
  /** 피상속인이 비거주자이거나 상속인 전원이 국외 거주 */
  abroad: boolean;
}

function urgencyOf(daysLeft: number): Urgency {
  if (daysLeft < 0) return "passed";
  if (daysLeft <= 14) return "urgent";
  if (daysLeft <= 30) return "soon";
  return "safe";
}

export function calcDeadlines(input: DeadlineInput): Deadline[] {
  const death = parseDate(input.deathDate);
  const known = parseDate(input.knownDate);
  const today = parseDate(input.today);

  // 3개월: 안 날부터
  const renunciation = addMonths(known, RENUNCIATION_MONTHS);
  // 6개월: 상속개시일이 속하는 달의 말일부터
  const monthEnd = endOfMonth(death);
  const filingMonths = input.abroad ? TAX_FILING_MONTHS_ABROAD : TAX_FILING_MONTHS;
  const taxFiling = addMonths(monthEnd, filingMonths);
  const acquisitionTax = addMonths(monthEnd, ACQUISITION_TAX_MONTHS);

  const rows: Deadline[] = [
    {
      key: "renunciation",
      label: "상속포기 · 한정승인",
      date: formatDate(renunciation),
      daysLeft: diffDays(today, renunciation),
      urgency: urgencyOf(diffDays(today, renunciation)),
      basis: `상속개시를 안 날(${input.knownDate})부터 3개월`,
      consequence:
        "아무것도 하지 않으면 단순승인한 것으로 보아 빚까지 전부 상속합니다. 되돌릴 수 없습니다.",
    },
    {
      key: "acquisition",
      label: "상속 취득세 신고 · 납부",
      date: formatDate(acquisitionTax),
      daysLeft: diffDays(today, acquisitionTax),
      urgency: urgencyOf(diffDays(today, acquisitionTax)),
      basis: `상속개시일이 속하는 달의 말일(${formatDate(monthEnd)})부터 6개월`,
      consequence: "무신고가산세 20%와 납부지연가산세가 붙습니다.",
    },
    {
      key: "tax",
      label: "상속세 신고 · 납부",
      date: formatDate(taxFiling),
      daysLeft: diffDays(today, taxFiling),
      urgency: urgencyOf(diffDays(today, taxFiling)),
      basis: `상속개시일이 속하는 달의 말일(${formatDate(monthEnd)})부터 ${filingMonths}개월`,
      consequence:
        "신고세액공제 3%를 못 받고, 무신고가산세 20%(부정행위는 40%)와 납부지연가산세가 붙습니다.",
    },
  ];

  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

/** 가장 급한 기한 */
export function mostUrgent(rows: Deadline[]): Deadline | null {
  const pending = rows.filter((r) => r.daysLeft >= 0);
  if (pending.length === 0) return null;
  return pending.reduce((a, b) => (a.daysLeft <= b.daysLeft ? a : b));
}
