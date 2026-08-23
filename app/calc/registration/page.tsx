import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import Link from "next/link";
import RegistrationCalculator from "@/components/RegistrationCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "상속등기 비용 계산기 — 취득세 2.8%, 무주택은 0.8%",
  description:
    "부동산을 상속받을 때 드는 취득세·지방교육세·농어촌특별세와 등기 수수료를 계산합니다. 무주택 가구 감면과 시가표준액 기준을 반영했습니다.",
  alternates: { canonical: "/calc/registration" },
};

const faq = [
  {
    q: "상속세를 안 내는데 취득세도 안 내나요?",
    a: "냅니다. 둘은 완전히 다른 세금입니다. 상속세는 국세로 남긴 재산 전체에 매기고, 취득세는 지방세로 부동산 등 등기·등록이 필요한 재산에 매깁니다. 상속세가 0원이어도 아파트를 물려받았다면 취득세를 신고·납부해야 합니다. 이걸 몰라 가산세를 무는 경우가 많습니다.",
  },
  {
    q: "실거래가로 계산하나요?",
    a: "아닙니다. 상속은 거래가 없으므로 시가표준액을 씁니다. 주택은 개별·공동주택가격, 토지는 개별공시지가입니다. 실거래가보다 낮은 것이 보통이라 세금도 그만큼 적게 나옵니다. 부동산공시가격 알리미에서 확인할 수 있습니다.",
  },
  {
    q: "매매로 살 때보다 세율이 낮은가요?",
    a: "경우에 따라 다릅니다. 매매는 1~3%(다주택·조정지역은 8~12%)이고 상속은 2.8% 단일입니다. 1주택자가 저가 주택을 살 때보다는 높지만, 다주택 중과세율보다는 훨씬 낮습니다. 무주택 가구가 주택을 상속받으면 0.8%로 가장 낮습니다.",
  },
  {
    q: "등기를 미루면 어떻게 되나요?",
    a: "취득세 신고기한(6개월)을 넘기면 무신고가산세 20%와 납부지연가산세가 붙습니다. 등기 자체에는 법정 기한이 없지만, 등기를 하지 않으면 그 부동산을 팔거나 담보로 쓸 수 없습니다. 시간이 지나 상속인이 또 사망하면 관계가 복잡해져 훨씬 어려워집니다.",
  },
  {
    q: "형제끼리 공동명의로 해야 하나요?",
    a: "협의분할로 한 사람 앞으로 할 수도 있고 지분대로 나눌 수도 있습니다. 공동명의는 나중에 팔 때 전원의 동의가 필요해 분쟁 소지가 있습니다. 다만 한 사람에게 몰아주면 나머지가 대가를 받는 경우 증여로 볼 여지가 있으니, 협의분할 단계에서 정리하는 것이 깔끔합니다.",
  },
];

export default function RegistrationPage() {
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
          { "@type": "ListItem", position: 2, name: "상속등기 비용 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">상속등기 비용 계산기</h1>
      <p className="mb-6 text-muted">
        부동산을 물려받을 때 드는 취득세와 등기 비용을 계산합니다. 상속세와는
        별개로 내는 세금입니다.
      </p>

      <RegistrationCalculator />

      <AdSlot slot="registration-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">상속세와 취득세는 다른 세금입니다</h2>
        <p>
          가장 많이 놓치는 지점입니다. &ldquo;우리는 상속세 대상이 아니라던데
          왜 세금 고지서가 오나&rdquo; 하는 경우가 여기서 나옵니다.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>상속세</strong> — 국세. 남긴 재산 <em>전체</em>에 매김. 공제가
            커서 대부분 0원.
          </li>
          <li>
            <strong>취득세</strong> — 지방세. 부동산·자동차 등 <em>등기·등록</em>이
            필요한 재산에 매김. 공제가 없어 물려받으면 낸다.
          </li>
        </ul>
        <p>
          둘 다 신고기한이 <strong>상속개시일이 속하는 달의 말일부터 6개월</strong>로
          같습니다. 챙길 때 함께 챙기면 됩니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">상속은 세율표가 따로 있습니다</h2>
        <p>
          매매로 집을 사면 1~3%, 다주택자나 조정대상지역이면 8~12%까지 올라갑니다.
          그런데 <strong>상속은 2.8% 단일</strong>입니다. 다주택자여도 중과되지
          않습니다.
        </p>
        <p>
          여기에 큰 감면이 하나 있습니다. <strong>무주택 가구가 주택을
          상속받으면 0.8%</strong>입니다. 세율이 3분의 1 아래로 내려갑니다.
          시가표준액 5억이면 1,400만원이 400만원이 되니 차이가 1,000만원입니다.
        </p>
        <p>
          부모님 집을 물려받는 무주택 자녀가 흔한 경우라, 해당되는지 꼭 확인해 볼
          만합니다. 요건 판정은 관할 시·군·구청 세무과에서 합니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">과세표준은 시가표준액</h2>
        <p>
          매매는 실제 거래가액이 과세표준이지만, 상속은 거래가 없으니{" "}
          <strong>시가표준액</strong>을 씁니다. 주택은 개별·공동주택가격, 토지는
          개별공시지가입니다.
        </p>
        <p>
          실거래가보다 낮은 것이 보통이라 세금도 적게 나옵니다. 값은{" "}
          <strong>부동산공시가격 알리미</strong>에서 무료로 확인할 수 있습니다.
          위 계산기에는 이 값을 넣으세요.
        </p>

        <h2 className="mt-8 text-xl font-bold">등기를 미루지 마세요</h2>
        <p>
          상속등기 자체에는 법정 기한이 없습니다. 그래서 미루는 경우가 많은데,
          시간이 지날수록 어려워집니다.
        </p>
        <p>
          등기가 안 되어 있으면 그 부동산을 팔 수도, 담보로 쓸 수도 없습니다. 더
          큰 문제는 <strong>상속인이 또 사망하는 경우</strong>입니다. 상속인의
          상속인까지 협의에 참여해야 해서 인원이 기하급수적으로 늘고, 연락이 안
          되는 사람이 한 명만 있어도 진행이 막힙니다. 수십 년 방치된 시골 땅에서
          실제로 벌어지는 일입니다.
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
            law: "지방세법 제11조 제1항 제1호 (상속으로 인한 취득)",
            detail:
              "상속으로 인한 부동산 취득의 세율은 2.8%(농지는 2.3%)입니다. 무주택 가구가 주택을 상속받는 경우에는 0.8%로 경감됩니다. 매매와 달리 다주택·조정대상지역 중과세율이 적용되지 않습니다.",
          },
          {
            law: "지방세법 제150조 (지방교육세)",
            detail:
              "취득세 과세표준에 취득세율에서 2%를 뺀 세율의 100분의 20을 적용해 계산합니다. 상속 취득의 경우 0.16%입니다.",
          },
          {
            law: "농어촌특별세법 제5조",
            detail:
              "취득세액의 10%에 해당하는 금액이 부과되며, 과세표준 기준으로는 0.2%입니다. 전용면적 85㎡ 이하의 주택은 면제됩니다.",
          },
          {
            law: "지방세법 제20조 (신고 및 납부)",
            detail:
              "상속개시일이 속하는 달의 말일부터 6개월 이내에 신고·납부해야 합니다. 기한을 넘기면 무신고가산세 20%와 납부지연가산세가 부과됩니다.",
          },
          {
            law: "과세표준 — 시가표준액",
            detail:
              "상속은 무상취득이므로 실거래가가 아닌 시가표준액을 과세표준으로 합니다. 주택은 개별주택가격·공동주택가격, 토지는 개별공시지가입니다.",
          },
        ]}
        note="농지 상속의 감면, 1가구 1주택 감면의 세부 요건 판정, 지분 상속 시 지분별 안분은 반영하지 않았습니다. 국민주택채권 매입률은 시가표준액 구간과 지역에 따라 달라 즉시 매도 시 할인료를 어림으로만 표시합니다. 법무사 보수는 포함하지 않았습니다. 확정 세액은 관할 시·군·구청 세무과와 위택스에서 확인하세요."
        examples={[
          {
            title: "유주택 자녀가 아파트 상속 · 시가표준액 5억 · 84㎡",
            steps: [
              "취득세 = 5억 × 2.8% = 1,400만원",
              "지방교육세 = 5억 × 0.16% = 80만원",
              "농어촌특별세 = 85㎡ 이하라 면제",
              "등기신청 수수료 15,000원",
            ],
            result: "세금 1,480만원 + 수수료",
          },
          {
            title: "무주택 자녀가 같은 아파트를 상속받으면",
            steps: [
              "취득세 = 5억 × 0.8% = 400만원",
              "지방교육세 = 80만원",
            ],
            result: "세금 480만원 — 유주택보다 1,000만원 적습니다",
          },
          {
            title: "전용 102㎡ 아파트 · 시가표준액 8억",
            steps: [
              "취득세 = 8억 × 2.8% = 2,240만원",
              "지방교육세 = 8억 × 0.16% = 128만원",
              "농어촌특별세 = 8억 × 0.2% = 160만원 (85㎡ 초과)",
            ],
            result: "세금 2,528만원",
          },
        ]}
        pitfalls={[
          {
            heading: "실거래가를 넣으면 세금이 과대 계산됩니다",
            body:
              "상속 취득세의 과세표준은 시가표준액입니다. 시세 10억 아파트의 공시가격이 7억이라면 7억을 넣어야 합니다. 부동산공시가격 알리미에서 무료로 확인할 수 있습니다.",
          },
          {
            heading: "상속세 신고와 취득세 신고는 창구가 다릅니다",
            body:
              "상속세는 국세청(홈택스), 취득세는 관할 시·군·구청(위택스)입니다. 한쪽만 하고 끝난 줄 아는 경우가 있으니 둘 다 챙기세요.",
          },
          {
            heading: "농어촌특별세는 면적으로 갈립니다",
            body:
              "전용면적 85㎡ 이하 주택은 면제됩니다. 84.9㎡와 85.1㎡가 다릅니다. 등기부나 건축물대장의 전용면적을 확인하세요. 주택이 아닌 토지·상가는 면적과 무관하게 부과됩니다.",
          },
          {
            heading: "무주택 감면은 '가구' 기준입니다",
            body:
              "상속인 본인뿐 아니라 세대원 전체가 주택을 갖고 있지 않아야 합니다. 배우자나 함께 사는 자녀 명의의 주택이 있으면 해당되지 않습니다. 요건이 까다로우니 미리 세무과에 확인하세요.",
          },
        ]}
        sources={[
          { label: "위택스", href: "https://www.wetax.go.kr" },
          { label: "부동산공시가격 알리미", href: "https://www.realtyprice.kr" },
          { label: "인터넷등기소", href: "https://www.iros.go.kr" },
          { label: "상속 기한 계산기", href: "/calc/deadline" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/deadline" className="text-accent underline-offset-4 hover:underline">상속 기한 D-day 계산기 →</Link></li>
          <li><Link href="/calc/share" className="text-accent underline-offset-4 hover:underline">법정상속분 계산기 →</Link></li>
          <li><Link href="/guide/inheritance-registration" className="text-accent underline-offset-4 hover:underline">상속등기 직접 하는 법 →</Link></li>
          {/* 상속 취득세율(2.8%)과 매매 취득세율은 다르다. 물려받은 집을 나중에
              팔거나, 형제 지분을 사서 정리하는 경우가 흔해 부동산노트로 보낸다. */}
          <li>
            <a href="https://budongsan.lifebanjang.com/calc/acquisition" className="text-accent underline-offset-4 hover:underline">매매 취득세 계산기 (부동산노트) →</a>
            <span className="block text-sm text-muted">상속 취득세율과 매매 취득세율은 다릅니다. 다른 상속인의 지분을 사서 정리하는 경우에 필요합니다.</span>
          </li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/registration" />
    </div>
  );
}
