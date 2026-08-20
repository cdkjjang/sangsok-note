// 상속 순위와 법정상속분
//
// 근거: 민법 제1000조(상속의 순위), 제1003조(배우자의 상속순위),
//       제1009조(법정상속분), 제1112조(유류분)
//
// [순위가 먼저, 지분은 그다음]
//   같은 순위 안에서만 나눈다. 1순위가 한 명이라도 있으면 2순위는 아무것도
//   받지 못한다. 흔히 "부모님이 돌아가시면 자식과 조부모가 나눈다"고 생각하는데
//   그렇지 않다. 자녀가 있으면 조부모는 상속인이 아니다.
//
//   1순위 직계비속 (자녀 → 손자녀)
//   2순위 직계존속 (부모 → 조부모)
//   3순위 형제자매
//   4순위 4촌 이내 방계혈족
//
// [배우자는 순위가 따로 없다]
//   배우자는 1순위나 2순위가 있으면 **그들과 공동상속인**이 되고,
//   둘 다 없으면 **단독 상속**한다. 3순위 형제자매와는 함께 상속하지 않는다.
//   즉 자녀도 부모도 없으면 형제자매는 한 푼도 받지 못하고 배우자가 다 받는다.
//
// [지분은 같은 순위끼리 균등, 배우자만 5할 가산]
//   자녀가 몇 명이든 균등하다. 장남·차남, 아들·딸, 혼인 여부, 같이 살았는지
//   모두 관계없다. 배우자만 1.5로 계산한다.
//
// ⚠️ 법정상속분은 '기본값'이지 강제가 아니다
//   상속인 전원이 합의하면 어떻게 나눠도 된다(협의분할). 유언이 있으면
//   유언이 우선한다. 다만 유언으로도 침해할 수 없는 최소 몫이 유류분이다.

/** 상속인 유형 */
export type HeirType = "spouse" | "child" | "parent" | "sibling";

/** 배우자 가산 비율 — 다른 상속인의 1.5배 */
export const SPOUSE_RATIO = 1.5;
export const OTHER_RATIO = 1;

/** 유류분 비율 (민법 제1112조) */
export const RESERVED_SHARE = {
  /** 직계비속·배우자 — 법정상속분의 1/2 */
  descendantOrSpouse: 0.5,
  /** 직계존속·형제자매 — 법정상속분의 1/3 */
  ascendantOrSibling: 1 / 3,
} as const;

export interface ShareInput {
  /** 배우자 생존 여부 */
  hasSpouse: boolean;
  /** 자녀 수 (1순위) */
  children: number;
  /** 생존한 직계존속 수 — 부모·조부모 (2순위) */
  parents: number;
  /** 형제자매 수 (3순위) */
  siblings: number;
  /** 나눌 상속재산 (원) */
  estate: number;
}

export interface SharePart {
  /** 상속인 표시 이름 */
  label: string;
  type: HeirType;
  /** 이 유형의 인원 수 */
  count: number;
  /** 1인당 지분 (0~1) */
  ratioEach: number;
  /** 1인당 금액 (원) */
  amountEach: number;
  /** 이 유형 전체 금액 (원) */
  amountTotal: number;
  /** 1인당 유류분 (원) */
  reservedEach: number;
}

export interface ShareResult {
  /** 실제로 상속받는 순위 (1~3). 상속인이 없으면 0 */
  rank: number;
  /** 순위 설명 */
  rankLabel: string;
  /** 상속인별 몫 */
  parts: SharePart[];
  /** 상속인이 아무도 없는지 */
  noHeir: boolean;
  /** 배제된 순위에 대한 안내 (있을 때만) */
  excluded: string | null;
}

/**
 * 법정상속분을 계산한다.
 *
 * 지분은 "배우자 1.5 : 나머지 각 1"로 두고 합으로 나눈다.
 * 예) 배우자 + 자녀 2 → 1.5 : 1 : 1 = 3.5분의 1.5, 1, 1
 */
export function calcLegalShare(input: ShareInput): ShareResult {
  const estate = Math.max(0, input.estate);
  const children = Math.max(0, Math.floor(input.children));
  const parents = Math.max(0, Math.floor(input.parents));
  const siblings = Math.max(0, Math.floor(input.siblings));

  // 어느 순위가 상속하는지 정한다
  let rank = 0;
  let coHeirType: HeirType | null = null;
  let coHeirCount = 0;
  let rankLabel = "";
  let excluded: string | null = null;

  if (children > 0) {
    rank = 1;
    coHeirType = "child";
    coHeirCount = children;
    rankLabel = "1순위 직계비속";
    if (parents > 0 || siblings > 0) {
      excluded =
        "자녀가 있으므로 부모·조부모와 형제자매는 상속인이 아닙니다. 같은 순위 안에서만 나눕니다.";
    }
  } else if (parents > 0) {
    rank = 2;
    coHeirType = "parent";
    coHeirCount = parents;
    rankLabel = "2순위 직계존속";
    if (siblings > 0) {
      excluded = "직계존속이 있으므로 형제자매는 상속인이 아닙니다.";
    }
  } else if (input.hasSpouse) {
    // 배우자만 있고 1·2순위가 없으면 배우자 단독. 형제자매는 상속하지 못한다.
    rank = 0;
    rankLabel = "배우자 단독상속";
    if (siblings > 0) {
      excluded =
        "배우자가 있으면 형제자매는 상속인이 되지 않습니다. 배우자가 전부 상속합니다.";
    }
  } else if (siblings > 0) {
    rank = 3;
    coHeirType = "sibling";
    coHeirCount = siblings;
    rankLabel = "3순위 형제자매";
  }

  const parts: SharePart[] = [];
  // 배우자는 1·2순위와만 공동상속한다. 3순위(형제자매)에 이르렀다는 것은
  // 배우자가 없다는 뜻이므로 여기서 배우자 몫은 0이다.
  const spouseUnits = input.hasSpouse && rank !== 3 ? SPOUSE_RATIO : 0;
  const coUnits = coHeirCount * OTHER_RATIO;
  const totalUnits = spouseUnits + coUnits;

  if (spouseUnits > 0) {
    const ratio = totalUnits > 0 ? SPOUSE_RATIO / totalUnits : 1;
    const amount = Math.floor(estate * ratio);
    parts.push({
      label: "배우자",
      type: "spouse",
      count: 1,
      ratioEach: ratio,
      amountEach: amount,
      amountTotal: amount,
      reservedEach: Math.floor(amount * RESERVED_SHARE.descendantOrSpouse),
    });
  }

  if (coHeirType && coHeirCount > 0) {
    const ratio = totalUnits > 0 ? OTHER_RATIO / totalUnits : 0;
    const amount = Math.floor(estate * ratio);
    const reservedRate =
      coHeirType === "child"
        ? RESERVED_SHARE.descendantOrSpouse
        : RESERVED_SHARE.ascendantOrSibling;
    const label =
      coHeirType === "child" ? "자녀" : coHeirType === "parent" ? "직계존속" : "형제자매";
    parts.push({
      label: `${label} (${coHeirCount}명)`,
      type: coHeirType,
      count: coHeirCount,
      ratioEach: ratio,
      amountEach: amount,
      amountTotal: amount * coHeirCount,
      reservedEach: Math.floor(amount * reservedRate),
    });
  }

  return {
    rank,
    rankLabel: rankLabel || "상속인 없음",
    parts,
    noHeir: parts.length === 0,
    excluded,
  };
}
