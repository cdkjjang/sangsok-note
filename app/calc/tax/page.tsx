import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import RelatedTools from "@/components/RelatedTools";
import Link from "next/link";
import InheritanceTaxCalculator from "@/components/InheritanceTaxCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "상속세 계산기 — 우리 집은 낼 일이 있나",
  description:
    "재산과 가족 관계를 넣으면 공제 내역과 상속세를 계산합니다. 일괄공제 5억·배우자공제 5억~30억·금융재산공제·동거주택공제 반영, 현행 세법 기준.",
  alternates: { canonical: "/calc/tax" },
};

const faq = [
  {
    q: "상속세는 10억까지 안 낸다던데 사실인가요?",
    a: "배우자가 계신 경우에 대체로 그렇습니다. 일괄공제 5억과 배우자상속공제 최소 5억이 기본으로 깔리기 때문입니다. 다만 배우자가 먼저 돌아가신 뒤의 상속(이른바 2차 상속)은 배우자공제가 없어 공제가 5억뿐입니다. 같은 재산이라도 세금이 확 늘어나는 이유가 이것입니다.",
  },
  {
    q: "형제가 많으면 세금이 줄어드나요?",
    a: "줄지 않습니다. 우리나라 상속세는 '유산세' 방식이라 피상속인이 남긴 재산 전체에 세율을 매깁니다. 상속인이 몇 명이든 세금 총액은 같고, 그 세금을 받은 비율대로 나눠 낼 뿐입니다. 각자 받은 몫에 따로 과세하는 '유산취득세'로 바꾸자는 논의가 있지만 아직 확정되지 않았습니다.",
  },
  {
    q: "자녀공제가 5억으로 오른다고 들었습니다",
    a: "발표만 됐고 국회에서 부결되어 현행 5천만원이 유지되고 있습니다. 이 계산기는 확정된 법령만 반영하므로 5천만원으로 계산합니다. 통과되면 그때 반영하겠습니다.",
  },
  {
    q: "돌아가시기 전에 미리 증여하면 상속세를 피할 수 있나요?",
    a: "기간이 관건입니다. 상속인에게 준 것은 10년, 상속인이 아닌 사람에게 준 것은 5년 이내면 상속재산에 다시 합산됩니다. 그 안에 돌아가시면 증여가 없던 것처럼 계산한다는 뜻입니다. 다만 이미 낸 증여세는 증여세액공제로 빼 줍니다.",
  },
  {
    q: "배우자에게 최대한 몰아주면 세금이 줄어드나요?",
    a: "1차 상속에서는 줄어듭니다. 배우자공제가 최대 30억까지 되기 때문입니다. 그런데 나중에 배우자가 돌아가실 때 그 재산이 다시 상속되면서 이번에는 배우자공제 없이 과세됩니다. 두 번의 상속을 합쳐서 봐야 실익이 보입니다. 금액이 크다면 세무 전문가와 상담하세요.",
  },
];

export default function TaxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "상속세 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">상속세 계산기</h1>
      <p className="mb-6 text-muted">
        재산과 가족 관계를 넣으면 어떤 공제가 얼마나 적용되는지 항목별로 보여주고
        세금을 계산합니다.
      </p>

      <InheritanceTaxCalculator />

      <AdSlot slot="tax-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">대부분의 집은 세금이 나오지 않습니다</h2>
        <p>
          상속세라고 하면 막연히 겁부터 나지만, 실제로 내는 집은 많지 않습니다.
          공제가 크기 때문입니다.
        </p>
        <p>
          기본이 되는 것이 <strong>일괄공제 5억</strong>입니다. 기초공제 2억에
          자녀·미성년자·연로자·장애인 공제를 더한 값과 비교해 큰 쪽을 택하는데,
          자녀가 아주 많지 않은 이상 일괄공제 5억이 큽니다.
        </p>
        <p>
          여기에 배우자가 살아 계시면 <strong>배우자상속공제 최소 5억</strong>이
          더해집니다. 배우자가 실제로 한 푼도 안 받아도 5억은 보장됩니다. 그래서
          배우자가 있는 가구는 대체로 <strong>10억까지 세금이 없습니다.</strong>
        </p>

        <h2 className="mt-8 text-xl font-bold">진짜 문제는 두 번째 상속입니다</h2>
        <p>
          아버지가 먼저 돌아가시고 어머니가 상속받았다가, 나중에 어머니가
          돌아가시면서 자녀에게 다시 상속되는 경우를 생각해 봅시다.
        </p>
        <p>
          <strong>두 번째 상속에는 배우자공제가 없습니다.</strong> 공제가 5억으로
          줄어듭니다. 같은 15억이라도 첫 번째 상속에서는 세금이 0원이었는데,
          두 번째에는 과세표준 10억에 30% 세율이 붙어 2억 3천만원가량이 나옵니다.
        </p>
        <p>
          그래서 &ldquo;일단 어머니 앞으로 다 돌려놓자&rdquo;는 선택이 항상
          유리한 것은 아닙니다. 두 번의 상속을 하나로 보고 판단해야 합니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">유산세와 유산취득세</h2>
        <p>
          우리나라 상속세는 <strong>유산세</strong> 방식입니다. 피상속인이 남긴
          재산 <em>전체</em>에 세율을 매기고, 그 세금을 상속인들이 받은 비율대로
          나눠 냅니다. 형제가 둘이든 다섯이든 총액은 같습니다.
        </p>
        <p>
          독일·일본 등이 쓰는 <strong>유산취득세</strong>는 다릅니다. 각자 받은
          몫에 따로 세율을 매기므로, 나눠 받을수록 낮은 세율 구간에 들어가 총액이
          줄어듭니다. 우리도 이 방식으로 바꾸자는 논의가 있고 2028년 시행을 목표로
          한 안이 나와 있지만, <strong>아직 확정되지 않았습니다.</strong> 이
          계산기는 현행 유산세 방식으로 계산합니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">세율표</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border-soft text-left">
                <th className="py-2 pr-3 font-bold">과세표준</th>
                <th className="py-2 pr-3 font-bold">세율</th>
                <th className="py-2 font-bold">누진공제</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">1억원 이하</td><td className="py-2 pr-3">10%</td><td className="py-2">—</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">1억 초과 5억 이하</td><td className="py-2 pr-3">20%</td><td className="py-2">1,000만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">5억 초과 10억 이하</td><td className="py-2 pr-3">30%</td><td className="py-2">6,000만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">10억 초과 30억 이하</td><td className="py-2 pr-3">40%</td><td className="py-2">1억 6,000만원</td></tr>
              <tr><td className="py-2 pr-3">30억 초과</td><td className="py-2 pr-3">50%</td><td className="py-2">4억 6,000만원</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          &ldquo;상속세 최고세율 50%&rdquo;라는 말 때문에 재산의 절반을 뺏긴다고
          오해하기 쉽습니다. 50%는 <strong>30억을 넘는 부분에만</strong> 붙습니다.
          게다가 공제를 뺀 과세표준 기준이라, 실제로 낸 세금을 재산으로 나눈{" "}
          <strong>실효세율은 훨씬 낮습니다.</strong> 위 계산기가 실효세율을 함께
          보여주는 이유입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border-soft bg-card p-4 shadow-sm">
              <dt className="font-bold"><span className="text-accent">Q.</span> {q}</dt>
              <dd className="mt-2 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CalcNotes
        updated="2026-08-19"
        basis={[
          {
            law: "상속세 및 증여세법 제26조 (세율)",
            detail:
              "과세표준 1억원 이하 10%, 5억원 이하 20%, 10억원 이하 30%, 30억원 이하 40%, 30억원 초과 50%의 5단계 누진세율입니다. 증여세와 같은 표를 씁니다.",
          },
          {
            law: "같은 법 제18조·제20조·제21조 (기초공제·인적공제·일괄공제)",
            detail:
              "기초공제 2억원에 자녀 1인당 5천만원, 미성년자 19세까지 연 1천만원, 65세 이상 1인당 5천만원, 장애인 기대여명 연 1천만원을 더한 금액과 일괄공제 5억원 중 큰 쪽을 공제합니다.",
          },
          {
            law: "같은 법 제19조 (배우자 상속공제)",
            detail:
              "배우자가 실제로 상속받은 금액을 공제하되, 법정상속분 상당액과 30억원을 넘을 수 없습니다. 실제 상속액이 적거나 없어도 5억원은 보장됩니다.",
          },
          {
            law: "같은 법 제22조·제23조의2 (금융재산·동거주택 상속공제)",
            detail:
              "순금융재산이 2천만원 이하면 전액, 초과하면 20%(최소 2천만원)를 한도 2억원까지 공제합니다. 10년 이상 동거한 무주택 상속인이 주택을 상속받으면 그 가액 전액을 한도 6억원까지 공제합니다.",
          },
          {
            law: "같은 법 제67조·제69조 (신고기한·신고세액공제)",
            detail:
              "상속개시일이 속하는 달의 말일부터 6개월 이내에 신고해야 하며, 기한 내 신고하면 산출세액의 3%를 공제합니다. 피상속인이 비거주자이거나 상속인 전원이 국외 거주면 9개월입니다.",
          },
        ]}
        note="가업상속공제·영농상속공제, 세대생략할증(30~40%), 증여세액공제, 단기재상속 세액공제, 비상장주식 평가는 반영하지 않았습니다. 재산 평가액(시가 vs 기준시가)은 입력값을 그대로 씁니다. 유산취득세 전환과 자녀공제 5억 상향은 확정되지 않아 넣지 않았습니다. 세무 자문이 아니며 확정 세액은 국세청·세무 전문가에게 확인하세요."
        examples={[
          {
            title: "배우자 생존 · 자녀 2 · 부동산 8억 + 금융 2억",
            steps: [
              "과세가액 = 10억 (채무·사전증여 없음)",
              "일괄공제 5억 (기초 2억 + 자녀 1억 = 3억보다 큼)",
              "배우자공제 5억 (실제 상속액이 없어도 최소 보장)",
              "금융재산공제 = 2억 × 20% = 4,000만원",
              "공제 합계 10억 4,000만원 > 과세가액 10억",
            ],
            result: "과세표준 0원 — 상속세 없음",
          },
          {
            title: "배우자 사망 후 2차 상속 · 자녀 2 · 부동산 15억",
            steps: [
              "과세가액 = 15억",
              "일괄공제 5억 (배우자공제 없음)",
              "과세표준 = 15억 − 5억 = 10억",
              "산출세액 = 10억 × 30% − 6,000만원 = 2억 4,000만원",
              "신고세액공제 3% = 720만원",
            ],
            result: "납부세액 2억 3,280만원 · 실효세율 15.5%",
          },
          {
            title: "같은 15억인데 배우자가 계신 경우",
            steps: [
              "일괄공제 5억 + 배우자공제 5억 = 10억",
              "과세표준 = 15억 − 10억 = 5억",
              "산출세액 = 5억 × 20% − 1,000만원 = 9,000만원",
              "신고세액공제 3% = 270만원",
            ],
            result: "납부세액 8,730만원 — 2차 상속보다 1억 4,550만원 적습니다",
          },
        ]}
        pitfalls={[
          {
            heading: "배우자공제는 '실제로 받은 만큼'입니다",
            body:
              "5억은 최소 보장이고, 그 이상을 공제받으려면 배우자가 실제로 그만큼 상속받고 신고기한 내에 재산 분할을 마쳐 등기까지 해야 합니다. 협의만 하고 등기를 미루면 공제를 못 받는 경우가 있습니다.",
          },
          {
            heading: "사전증여는 10년을 봅니다",
            body:
              "상속인에게 증여한 것은 10년, 상속인이 아닌 사람(손자녀·며느리 등)에게 준 것은 5년 이내면 상속재산에 합산됩니다. '미리 줬으니 상관없다'가 아니라 기간이 지나야 합니다.",
          },
          {
            heading: "상속세가 0원이어도 신고는 하는 편이 낫습니다",
            body:
              "신고 의무가 없는 경우에도 신고해 두면 나중에 그 재산을 팔 때 취득가액을 입증하기 쉽습니다. 신고가 없으면 낮은 기준시가로 취득가액이 잡혀 양도소득세가 커질 수 있습니다.",
          },
          {
            heading: "낼 돈이 없어도 신고는 먼저 하세요",
            body:
              "무신고가산세 20%(부정행위 40%)는 신고를 안 했을 때 붙습니다. 신고하고 못 내면 납부지연가산세만 붙습니다. 상속세는 최대 10년 분납(연부연납)과 부동산·주식으로 내는 물납 제도가 있으니 신고와 함께 신청하세요.",
          },
        ]}
        sources={[
          { label: "국세청 홈택스", href: "https://hometax.go.kr" },
          { label: "국세상담센터 126", href: "https://call.nts.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "법정상속분 계산기", href: "/calc/share" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/share" className="text-accent underline-offset-4 hover:underline">법정상속분 계산기 →</Link></li>
          <li><Link href="/calc/deadline" className="text-accent underline-offset-4 hover:underline">상속 기한 D-day 계산기 →</Link></li>
          <li><Link href="/guide/inheritance-tax-threshold" className="text-accent underline-offset-4 hover:underline">우리 집은 상속세 낼 일이 있나 →</Link></li>
          {/* 사전증여는 상속세 계산에 합산되므로 두 세금을 같이 봐야 한다.
              증여세 계산은 세금노트 몫이라 여기서 다시 만들지 않는다. */}
          <li>
            <a href="https://tax.lifebanjang.com/calc/gift-tax" className="text-accent underline-offset-4 hover:underline">증여세 계산기 (세금노트) →</a>
            <span className="block text-sm text-muted">생전에 미리 나눠 주는 쪽이 나은지 비교할 때. 사망 전 10년 이내의 증여는 상속재산에 합산됩니다.</span>
          </li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/tax" />
      <RelatedTools calc="/calc/tax" />
    </div>
  );
}
