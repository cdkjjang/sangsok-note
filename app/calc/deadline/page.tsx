import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import RelatedTools from "@/components/RelatedTools";
import Link from "next/link";
import DeadlineCalculator from "@/components/DeadlineCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "상속 기한 D-day 계산기 — 포기 3개월, 신고 6개월",
  description:
    "상속포기·한정승인 3개월과 상속세·취득세 신고 6개월이 각각 언제까지인지 날짜로 계산합니다. 3개월을 넘기면 빚까지 자동으로 상속됩니다.",
  alternates: { canonical: "/calc/deadline" },
};

const faq = [
  {
    q: "3개월을 넘기면 정말 빚까지 떠안나요?",
    a: "그렇습니다. 민법은 3개월 안에 포기나 한정승인을 하지 않으면 '단순승인'한 것으로 봅니다. 아무것도 하지 않는 것이 곧 '재산도 빚도 전부 받겠다'는 의사표시가 되는 구조입니다. 다만 중대한 과실 없이 빚을 몰랐다면, 그 사실을 안 날부터 3개월 안에 '특별한정승인'을 할 수 있습니다.",
  },
  {
    q: "상속포기와 한정승인은 뭐가 다른가요?",
    a: "상속포기는 처음부터 상속인이 아니었던 것으로 만드는 것이고, 한정승인은 상속받은 재산 범위 안에서만 빚을 갚는 것입니다. 재산이 빚보다 확실히 적으면 포기가 간단하지만, 포기하면 다음 순위로 빚이 넘어갑니다. 재산과 빚 중 어느 쪽이 많은지 불확실하다면 한정승인이 안전합니다.",
  },
  {
    q: "제가 포기하면 끝나는 것 아닌가요?",
    a: "아닙니다. 1순위가 전원 포기하면 2순위(부모·조부모)로, 그다음 3순위(형제자매)로 넘어갑니다. 최악의 경우 어린 조카까지 상속인이 됩니다. 그래서 실무에서는 상속인 중 한 명이 한정승인을 하고 나머지가 포기하는 방식을 많이 씁니다.",
  },
  {
    q: "재산이 얼마인지 모르는데 어떻게 판단하나요?",
    a: "'안심상속 원스톱서비스'를 이용하세요. 정부24나 주민센터에서 신청하면 피상속인의 예금·보험·주식·부동산·자동차·세금 체납·대출까지 한 번에 조회됩니다. 사망신고할 때 함께 신청할 수 있고, 사망일이 속한 달의 말일부터 1년 안에 신청하면 됩니다.",
  },
  {
    q: "6개월 안에 세금을 못 내면 어떻게 되나요?",
    a: "신고와 납부는 별개입니다. 신고만 기한 내에 하면 무신고가산세 20%를 피하고 신고세액공제 3%도 받습니다. 낼 돈이 없다면 최대 10년에 걸쳐 나눠 내는 연부연납이나 부동산·주식으로 내는 물납을 신청할 수 있습니다. 신청은 신고와 함께 해야 합니다.",
  },
];

export default function DeadlinePage() {
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
          { "@type": "ListItem", position: 2, name: "상속 기한 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">상속 기한 D-day 계산기</h1>
      <p className="mb-6 text-muted">
        돌아가신 날을 넣으면 포기·한정승인 3개월과 세금 신고 6개월이 각각 언제까지인지
        날짜로 계산합니다.
      </p>

      <DeadlineCalculator />

      <AdSlot slot="deadline-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">
          가장 위험한 기한은 3개월입니다
        </h2>
        <p>
          상속 기한은 여러 개지만 성격이 다릅니다. 세금 기한은 늦으면 가산세로
          끝나지만, <strong>3개월은 놓치는 순간 결과가 바뀝니다.</strong>
        </p>
        <p>
          민법은 상속개시를 안 날부터 3개월 안에 포기나 한정승인을 하지 않으면{" "}
          <strong>단순승인한 것으로 봅니다.</strong> 아무것도 하지 않는 것이 곧
          &ldquo;재산도 빚도 전부 받겠다&rdquo;는 의사표시가 되는 구조입니다.
        </p>
        <p>
          부모님이 돌아가신 직후 석 달은 정신이 없는 시기입니다. 장례 치르고
          유품 정리하고 서류 떼러 다니다 보면 금방 지납니다. 그 사이 몰랐던 빚이
          있었다면 그대로 떠안게 됩니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          기산점이 &lsquo;사망일&rsquo;이 아니라 &lsquo;안 날&rsquo;입니다
        </h2>
        <p>
          3개월은 <strong>상속개시가 있음을 안 날</strong>부터 셉니다. 대부분은
          사망일과 같지만, 연락이 끊긴 가족이라면 나중에 알게 된 날이 기산점이
          됩니다.
        </p>
        <p>
          반대로 세금 기한은 <strong>사망일</strong> 기준입니다. 정확히는
          상속개시일이 속하는 달의 말일부터 6개월입니다. 8월 10일에 돌아가셨다면
          8월 31일부터 세어 다음 해 2월 말일이 기한입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          재산을 모르겠다면 안심상속 원스톱서비스
        </h2>
        <p>
          판단하려면 재산과 빚을 알아야 하는데, 부모님 재산을 정확히 아는 자녀는
          드뭅니다. 이럴 때 쓰는 것이 <strong>안심상속 원스톱서비스</strong>입니다.
        </p>
        <p>
          정부24나 주민센터에서 신청하면 피상속인의 예금·보험·주식·채권·부동산·
          자동차·국세 체납·지방세 체납·대출까지 한 번에 조회됩니다. 사망신고할 때
          함께 신청할 수 있고, 사망일이 속한 달의 말일부터 1년 안에 하면 됩니다.
        </p>
        <p>
          <strong>3개월 기한 안에 결과를 받아 보는 것이 중요합니다.</strong> 결과를
          보고 재산보다 빚이 많으면 포기나 한정승인을 검토하면 됩니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          포기하면 다음 순위로 넘어갑니다
        </h2>
        <p>
          여기서 실수가 잦습니다. 자녀들이 전부 상속을 포기하면 끝나는 것이 아니라,{" "}
          <strong>2순위인 조부모에게, 그다음 3순위인 형제자매에게</strong> 빚이
          넘어갑니다. 어린 조카까지 상속인이 되는 경우도 있습니다.
        </p>
        <p>
          그래서 실무에서는 <strong>상속인 중 한 명이 한정승인을 하고 나머지가
          포기하는</strong> 방식을 많이 씁니다. 한정승인한 사람이 재산 범위에서
          정리하면 뒤 순위로 넘어가지 않습니다.
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
            law: "민법 제1019조 (승인·포기의 기간)",
            detail:
              "상속인은 상속개시가 있음을 안 날부터 3개월 내에 단순승인·한정승인 또는 포기를 할 수 있습니다. 이 기간 내에 하지 않으면 단순승인한 것으로 봅니다. 상속채무가 상속재산을 초과하는 사실을 중대한 과실 없이 몰랐다면 그 사실을 안 날부터 3개월 내에 한정승인할 수 있습니다(특별한정승인).",
          },
          {
            law: "상속세 및 증여세법 제67조 (상속세 과세표준신고)",
            detail:
              "상속개시일이 속하는 달의 말일부터 6개월 이내에 신고해야 합니다. 피상속인이 비거주자이거나 상속인 전원이 국외에 거주하는 경우에는 9개월입니다.",
          },
          {
            law: "지방세법 제20조 (신고 및 납부)",
            detail:
              "상속으로 인한 취득은 상속개시일이 속하는 달의 말일부터 6개월 이내에 취득세를 신고·납부해야 합니다. 상속세와 별개의 세금이라 상속세가 없어도 신고 대상입니다.",
          },
          {
            law: "기한의 말일",
            detail:
              "기한 마지막 날이 토요일·일요일 또는 공휴일이면 그다음 근무일까지로 연장됩니다. 이 계산기는 달력상 날짜만 계산하므로 실제로는 하루 이틀 여유가 있을 수 있습니다.",
          },
        ]}
        note="이 계산기는 날짜만 계산합니다. 포기와 한정승인 중 무엇이 유리한지, 특별한정승인이 가능한지는 재산·채무 내역과 개별 사정에 따라 달라지므로 법률 전문가와 상담하세요. 법률 자문이 아닙니다."
        examples={[
          {
            title: "2026-08-10 사망 · 당일 인지",
            steps: [
              "포기·한정승인 = 안 날 2026-08-10 + 3개월",
              "세금 기산점 = 사망월 말일 2026-08-31",
              "상속세·취득세 = 2026-08-31 + 6개월",
            ],
            result: "포기 2026-11-10 / 세금 2027-02-28",
          },
          {
            title: "같은 사망일인데 10월 1일에야 알게 된 경우",
            steps: [
              "포기·한정승인 = 안 날 2026-10-01 + 3개월 = 2027-01-01",
              "세금 기한은 사망일 기준이라 그대로",
            ],
            result: "포기 기한만 밀리고 세금 기한은 2027-02-28로 동일",
          },
          {
            title: "상속인 전원이 국외 거주",
            steps: [
              "상속세 신고기한이 6개월 → 9개월",
              "취득세는 그대로 6개월",
            ],
            result: "상속세 2027-05-31 / 취득세 2027-02-28 — 서로 다릅니다",
          },
        ]}
        pitfalls={[
          {
            heading: "상속재산을 처분하면 포기할 수 없게 됩니다",
            body:
              "예금을 인출하거나 부동산을 처분하는 등 상속재산을 임의로 사용하면 단순승인한 것으로 간주됩니다(법정단순승인). 포기나 한정승인을 검토 중이라면 3개월이 지날 때까지 상속재산에 손대지 마세요. 장례비 지출 정도는 예외로 보지만 다툼의 소지가 있습니다.",
          },
          {
            heading: "포기는 다음 순위로 넘어갑니다",
            body:
              "자녀가 모두 포기하면 조부모, 그다음 형제자매, 4촌 이내 방계혈족까지 순차로 상속인이 됩니다. 친척들이 영문도 모르고 빚 독촉을 받는 상황이 실제로 생깁니다. 한 명이 한정승인하는 방식을 함께 검토하세요.",
          },
          {
            heading: "한정승인은 신고 후 절차가 남아 있습니다",
            body:
              "법원에 신고하는 것으로 끝나지 않습니다. 신고 수리 후 5일 내에 채권자에게 공고하고, 재산 목록을 만들어 배당 절차를 밟아야 합니다. 이걸 하지 않으면 손해배상 책임이 생길 수 있어 실무상 변호사를 통하는 경우가 많습니다.",
          },
          {
            heading: "신고와 납부는 별개입니다",
            body:
              "낼 돈이 없어도 신고는 하세요. 신고만 기한 내에 하면 무신고가산세 20%를 피하고 신고세액공제 3%도 받습니다. 연부연납(최대 10년 분납)과 물납은 신고와 함께 신청해야 합니다.",
          },
        ]}
        sources={[
          { label: "정부24 안심상속 원스톱서비스", href: "https://www.gov.kr" },
          { label: "대한민국 법원 전자소송", href: "https://ecfs.scourt.go.kr" },
          { label: "대한법률구조공단 132", href: "https://www.klac.or.kr" },
          { label: "상속세 계산기", href: "/calc/tax" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/tax" className="text-accent underline-offset-4 hover:underline">상속세 계산기 →</Link></li>
          <li><Link href="/calc/registration" className="text-accent underline-offset-4 hover:underline">상속등기 비용 계산기 →</Link></li>
          <li><Link href="/guide/renounce-or-limited" className="text-accent underline-offset-4 hover:underline">빚이 더 많을 때 — 포기와 한정승인 →</Link></li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/deadline" />
      <RelatedTools calc="/calc/deadline" />
    </div>
  );
}
