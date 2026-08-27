/**
 * 이 노트의 계산기를 쓴 사람이 **다음에 마주칠 질문**과, 그 답이 있는
 * 다른 노트의 계산기.
 *
 * ⚠️ 이 파일은 워크스페이스 생성기로 만든다. 손으로 고치면 다음 생성 때 덮인다.
 *
 * 규칙 (components/RelatedTools.tsx 주석 참조):
 *   - 계산기마다 최대 3개. 페이지마다 내용이 달라야 한다.
 *   - 같은 노트 안의 계산기는 넣지 않는다.
 *   - "관련 계산기"가 아니라 그 사람이 실제로 다음에 겪는 일로 적는다.
 */
export type RelatedTool = {
  /** 그 사람이 다음에 던지는 질문 — 링크 텍스트가 된다 */
  question: string;
  /** 어느 노트인지 */
  note: string;
  /** 어떤 계산기인지 */
  tool: string;
  /** 전체 URL (다른 도메인이므로 절대 경로) */
  href: string;
};

export const RELATED_TOOLS: Record<string, RelatedTool[]> = {
  "/calc/tax": [
    {
      question: "미리 물려주면 증여세가 더 적나요",
      note: "세금노트",
      tool: "증여세 계산기",
      href: "https://tax.lifebanjang.com/calc/gift-tax",
    },
    {
      question: "물려받은 집을 팔면 양도세는 얼마인가요",
      note: "부동산노트",
      tool: "양도소득세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/transfer",
    },
    {
      question: "남은 배우자가 기초연금을 받을 수 있나요",
      note: "연금노트",
      tool: "기초연금 계산기",
      href: "https://pension.lifebanjang.com/calc/basic",
    },
  ],
  "/calc/share": [
    {
      question: "미리 증여받은 것이 있으면 어떻게 되나요",
      note: "세금노트",
      tool: "증여세 계산기",
      href: "https://tax.lifebanjang.com/calc/gift-tax",
    },
    {
      question: "물려받은 집의 보유세는 얼마인가요",
      note: "부동산노트",
      tool: "보유세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/holding",
    },
    {
      question: "부의금은 얼마가 적당한가요",
      note: "경조사노트",
      tool: "부의금 계산기",
      href: "https://gyeongjosa.lifebanjang.com/funeral/gift",
    },
  ],
  "/calc/deadline": [
    {
      question: "부의금은 얼마가 적당한가요",
      note: "경조사노트",
      tool: "부의금 계산기",
      href: "https://gyeongjosa.lifebanjang.com/funeral/gift",
    },
    {
      question: "물려받은 부동산 취득세는 언제 내나요",
      note: "부동산노트",
      tool: "취득세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/acquisition",
    },
    {
      question: "미리 증여하는 편이 나았을까요",
      note: "세금노트",
      tool: "증여세 계산기",
      href: "https://tax.lifebanjang.com/calc/gift-tax",
    },
  ],
  "/calc/registration": [
    {
      question: "등기하고 나면 보유세가 얼마인가요",
      note: "부동산노트",
      tool: "보유세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/holding",
    },
    {
      question: "나중에 팔면 양도세는 얼마인가요",
      note: "부동산노트",
      tool: "양도소득세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/transfer",
    },
    {
      question: "증여로 받았다면 세금이 달랐을까요",
      note: "세금노트",
      tool: "증여세 계산기",
      href: "https://tax.lifebanjang.com/calc/gift-tax",
    },
  ],
};
