import type { Metadata } from "next";
import Link from "next/link";
import LegalShareCalculator from "@/components/LegalShareCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "법정상속분 계산기 — 상속 순위와 각자의 몫",
  description:
    "누가 상속인이 되는지 순위로 판정하고, 배우자 1.5 : 자녀 1 비율로 각자의 몫과 유류분을 계산합니다. 형제자매가 상속받지 못하는 경우도 함께 안내합니다.",
  alternates: { canonical: "/calc/share" },
};

const faq = [
  {
    q: "장남이 더 받는 것 아닌가요?",
    a: "아닙니다. 민법은 자녀를 균등하게 봅니다. 장남·차남, 아들·딸, 혼인 여부, 함께 살았는지 모두 지분에 영향을 주지 않습니다. 다만 피상속인을 특별히 부양했거나 재산 유지에 기여한 사람은 '기여분'을 주장할 수 있고, 생전에 미리 받은 재산이 있으면 '특별수익'으로 조정됩니다.",
  },
  {
    q: "부모님이 돌아가시면 조부모도 상속받나요?",
    a: "자녀가 한 명이라도 있으면 조부모는 상속인이 아닙니다. 상속은 같은 순위 안에서만 나눕니다. 1순위 직계비속이 있으면 2순위 직계존속은 아무것도 받지 못합니다.",
  },
  {
    q: "자녀 없이 배우자만 있으면 시부모·형제와 나누나요?",
    a: "시부모(피상속인의 부모)가 살아 계시면 배우자와 함께 상속합니다. 부모가 모두 돌아가셨다면 배우자가 단독으로 전부 상속하고, 형제자매는 한 푼도 받지 못합니다. 배우자는 3순위와는 공동상속하지 않기 때문입니다.",
  },
  {
    q: "유류분이 뭔가요?",
    a: "유언으로도 뺏을 수 없는 최소한의 몫입니다. 직계비속과 배우자는 법정상속분의 1/2, 직계존속과 형제자매는 1/3입니다. 유언이나 생전 증여로 이보다 적게 받았다면 더 받은 사람에게 반환을 청구할 수 있습니다. 다만 청구 기간이 짧으니 유의하세요.",
  },
  {
    q: "법정상속분대로 꼭 나눠야 하나요?",
    a: "아닙니다. 상속인 전원이 합의하면 어떤 비율로 나눠도 됩니다(협의분할). 한 사람이 전부 갖는 것도 가능합니다. 법정상속분은 합의가 안 될 때의 기준이자, 유류분을 계산하는 출발점입니다.",
  },
];

export default function SharePage() {
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
          { "@type": "ListItem", position: 2, name: "법정상속분 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">법정상속분 계산기</h1>
      <p className="mb-6 text-muted">
        누가 상속인이 되는지 먼저 판정하고, 각자의 몫과 유류분을 계산합니다.
      </p>

      <LegalShareCalculator />

      <AdSlot slot="share-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">순위가 먼저, 지분은 그다음</h2>
        <p>
          상속에서 가장 먼저 정해야 할 것은 <strong>누가 상속인인가</strong>입니다.
          민법은 순위를 정해 두었고, <strong>같은 순위 안에서만 나눕니다.</strong>
        </p>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li><strong>1순위</strong> — 직계비속 (자녀, 없으면 손자녀)</li>
          <li><strong>2순위</strong> — 직계존속 (부모, 없으면 조부모)</li>
          <li><strong>3순위</strong> — 형제자매</li>
          <li><strong>4순위</strong> — 4촌 이내 방계혈족</li>
        </ol>
        <p>
          앞 순위가 한 명이라도 있으면 뒤 순위는 상속인이 되지 않습니다. 자녀가
          있으면 조부모도, 형제자매도 아무것도 받지 못합니다. &ldquo;다 같이
          나누는 것&rdquo;이라는 생각이 여기서 어긋납니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">배우자는 순위가 따로 없습니다</h2>
        <p>
          배우자는 1순위나 2순위가 있으면 <strong>그들과 함께</strong> 상속하고,
          둘 다 없으면 <strong>혼자 전부</strong> 상속합니다.
        </p>
        <p>
          여기서 자주 오해가 생깁니다. 자녀가 없는 부부에서 한쪽이 먼저 돌아가시면,
          시부모가 계실 때는 배우자와 시부모가 나눕니다. 그런데 시부모도 이미
          돌아가셨다면 <strong>형제자매가 아니라 배우자가 전부 받습니다.</strong>{" "}
          배우자는 3순위와는 공동상속하지 않기 때문입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">지분은 균등, 배우자만 1.5</h2>
        <p>
          같은 순위 안에서는 균등합니다. 자녀가 몇 명이든 똑같이 나눕니다. 배우자만
          다른 상속인의 <strong>1.5배</strong>를 받습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[440px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border-soft text-left">
                <th className="py-2 pr-3 font-bold">가족 구성</th>
                <th className="py-2 pr-3 font-bold">비율</th>
                <th className="py-2 font-bold">7억이라면</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">배우자 + 자녀 1</td><td className="py-2 pr-3">1.5 : 1</td><td className="py-2">4.2억 / 2.8억</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">배우자 + 자녀 2</td><td className="py-2 pr-3">1.5 : 1 : 1</td><td className="py-2">3억 / 2억 / 2억</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">배우자 + 부모 2</td><td className="py-2 pr-3">1.5 : 1 : 1</td><td className="py-2">3억 / 2억 / 2억</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">자녀 2 (배우자 없음)</td><td className="py-2 pr-3">1 : 1</td><td className="py-2">3.5억 / 3.5억</td></tr>
              <tr><td className="py-2 pr-3">배우자만 (자녀·부모 없음)</td><td className="py-2 pr-3">단독</td><td className="py-2">7억</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 text-xl font-bold">이 숫자는 기본값입니다</h2>
        <p>
          법정상속분은 <strong>합의가 안 될 때의 기준</strong>입니다. 상속인 전원이
          동의하면 어떤 비율로 나눠도 되고, 한 사람이 전부 갖는 것도 가능합니다
          (협의분할). 유언이 있으면 유언이 먼저입니다.
        </p>
        <p>
          다만 유언으로도 침해할 수 없는 최소 몫이 <strong>유류분</strong>입니다.
          직계비속과 배우자는 법정상속분의 1/2, 직계존속과 형제자매는 1/3입니다.
          위 계산기가 각자의 유류분을 함께 보여주는 이유입니다.
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
            law: "민법 제1000조 (상속의 순위)",
            detail:
              "1순위 직계비속, 2순위 직계존속, 3순위 형제자매, 4순위 4촌 이내 방계혈족 순으로 상속인이 됩니다. 같은 순위가 여러 명이면 최근친을 먼저로 하고, 촌수가 같으면 공동상속인이 됩니다.",
          },
          {
            law: "민법 제1003조 (배우자의 상속순위)",
            detail:
              "배우자는 직계비속 또는 직계존속이 있으면 그들과 같은 순위로 공동상속인이 되고, 둘 다 없으면 단독상속인이 됩니다. 형제자매와는 공동상속하지 않습니다.",
          },
          {
            law: "민법 제1009조 (법정상속분)",
            detail:
              "같은 순위의 상속인이 여러 명이면 그 상속분은 균분합니다. 배우자의 상속분은 직계비속·직계존속의 상속분에 5할을 가산합니다.",
          },
          {
            law: "민법 제1112조 (유류분의 권리자와 유류분)",
            detail:
              "직계비속과 배우자는 법정상속분의 2분의 1, 직계존속과 형제자매는 3분의 1을 유류분으로 가집니다. 유언이나 증여로 이보다 적게 받았다면 반환을 청구할 수 있습니다.",
          },
        ]}
        note="기여분(민법 제1008조의2)과 특별수익(제1008조)은 반영하지 않았습니다. 피상속인을 특별히 부양했거나 생전에 재산을 미리 받은 경우 실제 분할에서 몫이 달라집니다. 대습상속(상속인이 먼저 사망한 경우 그 자녀가 대신 상속)도 계산에 넣지 않았습니다. 법률 자문이 아니며, 분쟁이 있다면 변호사와 상담하세요."
        examples={[
          {
            title: "배우자 + 자녀 2 · 재산 7억",
            steps: [
              "1순위 직계비속이 있으므로 배우자와 자녀가 공동상속",
              "비율 = 배우자 1.5 : 자녀 1 : 자녀 1 = 3 : 2 : 2",
              "배우자 = 7억 × 3/7 = 3억",
              "자녀 각 = 7억 × 2/7 = 2억",
            ],
            result: "배우자 3억 / 자녀 각 2억 · 자녀 유류분은 각 1억",
          },
          {
            title: "자녀 없음 · 배우자 + 시부모 2 · 재산 7억",
            steps: [
              "1순위가 없으므로 2순위 직계존속이 배우자와 공동상속",
              "비율 = 배우자 1.5 : 부 1 : 모 1",
              "배우자 = 3억, 부모 각 2억",
            ],
            result: "형제자매가 있어도 이 단계에서는 상속인이 아닙니다",
          },
          {
            title: "자녀·부모 모두 없음 · 배우자 + 형제 3 · 재산 5억",
            steps: [
              "1·2순위가 모두 없음",
              "배우자는 3순위와 공동상속하지 않으므로 단독상속",
            ],
            result: "배우자 5억 전액 · 형제자매는 0원",
          },
        ]}
        pitfalls={[
          {
            heading: "손자녀는 자녀가 있으면 상속인이 아닙니다",
            body:
              "직계비속 중에서도 촌수가 가까운 쪽이 먼저입니다. 자녀가 살아 있으면 손자녀는 상속인이 되지 않습니다. 다만 자녀가 먼저 사망했다면 그 자녀(손자녀)가 대신 상속합니다(대습상속).",
          },
          {
            heading: "사실혼 배우자는 상속권이 없습니다",
            body:
              "혼인신고를 하지 않은 사실혼 관계는 상속인이 되지 못합니다. 재산분할청구나 특별연고자 분여 청구 등 다른 경로를 검토해야 합니다.",
          },
          {
            heading: "이혼한 배우자도 상속권이 없습니다",
            body:
              "이혼이 확정되면 상속권이 사라집니다. 다만 이혼한 배우자와의 사이에서 태어난 자녀는 여전히 1순위 상속인입니다. 재혼 가정에서 자주 문제가 되는 지점입니다.",
          },
          {
            heading: "계자녀는 입양해야 상속인이 됩니다",
            body:
              "재혼 배우자의 자녀는 법률상 친자관계가 없으면 상속인이 아닙니다. 친양자 입양이나 일반 입양 절차를 밟아야 상속권이 생깁니다.",
          },
        ]}
        sources={[
          { label: "찾기쉬운 생활법령정보", href: "https://easylaw.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "대한법률구조공단 132", href: "https://www.klac.or.kr" },
          { label: "상속세 계산기", href: "/calc/tax" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/tax" className="text-accent underline-offset-4 hover:underline">상속세 계산기 →</Link></li>
          <li><Link href="/calc/deadline" className="text-accent underline-offset-4 hover:underline">상속 기한 D-day 계산기 →</Link></li>
          <li><Link href="/guide/who-inherits" className="text-accent underline-offset-4 hover:underline">누가 상속인이 되나 — 순위와 대습상속 →</Link></li>
        </ul>
      </section>
    </div>
  );
}
