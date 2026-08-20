import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import HomeNotes from "@/components/HomeNotes";
import { guides } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TOOLS = [
  {
    href: "/calc/tax",
    title: "상속세 계산기",
    desc: "공제 내역을 항목별로 보여주고 실제로 낼 세금을 계산",
    badge: "상속세",
  },
  {
    href: "/calc/share",
    title: "법정상속분 계산기",
    desc: "누가 상속인인지 순위로 판정하고 각자의 몫과 유류분까지",
    badge: "상속분",
  },
  {
    href: "/calc/deadline",
    title: "상속 기한 D-day",
    desc: "포기·한정승인 3개월, 세금 신고 6개월이 언제까지인지",
    badge: "기한",
  },
  {
    href: "/calc/registration",
    title: "상속등기 비용",
    desc: "취득세 2.8%, 무주택 가구는 0.8%. 상속세와 별개입니다",
    badge: "등기",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-6 text-center sm:py-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          부모님이 남기신 것을
          <br className="sm:hidden" /> 정리할 때
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          상속세가 실제로 나오는지, 형제끼리 어떻게 나누는 게 법정 몫인지,
          빚이 있을 때 언제까지 결정해야 하는지 — 슬픔 속에서 챙기기 어려운
          것들을 한곳에 모았습니다.
        </p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
              {tool.badge}
            </span>
            <h2 className="mt-3 text-lg font-bold leading-snug">{tool.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{tool.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">상속 가이드</h2>
          <Link href="/guide" className="text-[15px] text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {guides.slice(0, 5).map((g) => (
            <li key={g.slug}>
              <div className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent">
                {/* 제목만 링크로 둔다 — 설명까지 앵커에 넣으면 본문 대부분이
                    링크 텍스트가 된다. */}
                <p className="font-bold leading-snug">
                  <Link href={`/guide/${g.slug}`} className="hover:text-accent">
                    {g.title}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-2 text-[15px] text-muted">{g.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <HomeNotes
        siteName={SITE_NAME}
        updated="2026-08-19"
        intro="상속은 슬픔과 행정이 겹치는 시기입니다. 그런데 하필 그때 기한이 돌아갑니다. 아래 네 가지가 실제로 결과를 가르는 지점입니다."
        scenarios={[
          {
            situation: "상속세를 내야 하는지 모르겠을 때",
            action:
              "대부분은 내지 않습니다. 일괄공제 5억에 배우자가 계시면 최소 5억이 더해져 10억까지는 세금이 없는 경우가 많습니다. 다만 배우자가 먼저 돌아가신 뒤의 두 번째 상속은 공제가 5억뿐이라 같은 재산이라도 세금이 확 늘어납니다.",
            href: "/calc/tax",
            label: "상속세 계산하기",
          },
          {
            situation: "형제끼리 어떻게 나눌지 이야기해야 할 때",
            action:
              "법정상속분은 자녀 균등, 배우자만 1.5배입니다. 장남이라고 더 받지 않습니다. 다만 이건 합의가 안 될 때의 기준일 뿐, 전원이 동의하면 어떻게 나눠도 됩니다. 유언으로도 뺏을 수 없는 최소 몫이 유류분입니다.",
            href: "/calc/share",
            label: "법정상속분 계산하기",
          },
          {
            situation: "빚이 있는 것 같을 때",
            action:
              "3개월이 갈림길입니다. 상속개시를 안 날부터 3개월 안에 포기나 한정승인을 하지 않으면 단순승인한 것으로 보아 빚까지 전부 떠안습니다. 아무것도 안 하는 것이 곧 '받겠다'는 뜻이 되는 구조라, 상속에서 가장 위험한 기한입니다.",
            href: "/calc/deadline",
            label: "기한 확인하기",
          },
          {
            situation: "부동산 명의를 옮겨야 할 때",
            action:
              "상속세가 0원이어도 취득세는 냅니다. 상속 취득세는 2.8%인데, 무주택 가구가 주택을 상속받으면 0.8%로 내려갑니다. 시가표준액 5억이면 1,000만원 차이입니다. 신고기한은 상속세와 같은 6개월입니다.",
            href: "/calc/registration",
            label: "등기 비용 계산하기",
          },
        ]}
        faq={[
          {
            q: "유산취득세로 바뀐다던데 반영돼 있나요?",
            a: "반영하지 않았습니다. 각자 받은 몫에 과세하는 유산취득세로 전환하는 안이 나와 있고 2028년 시행을 목표로 하지만 확정되지 않았습니다. 자녀공제를 5천만원에서 5억으로 올리는 안도 국회에서 부결됐습니다. 이 사이트는 확정된 법령만 계산에 넣습니다. 통과되면 그때 반영하겠습니다.",
          },
          {
            q: "부모님 재산이 얼마인지 모릅니다",
            a: "정부24나 주민센터의 '안심상속 원스톱서비스'를 이용하세요. 예금·보험·주식·부동산·자동차·세금 체납·대출까지 한 번에 조회됩니다. 사망신고할 때 함께 신청할 수 있고, 사망일이 속한 달의 말일부터 1년 안에 하면 됩니다. 3개월 기한 안에 결과를 보는 것이 중요합니다.",
          },
          {
            q: "계산 결과가 세무사가 말한 금액과 다릅니다",
            a: "재산 평가 방식에서 차이가 나기 쉽습니다. 이 계산기는 입력한 금액을 그대로 쓰지만, 실무에서는 시가·감정가·기준시가 중 무엇을 적용하느냐로 결과가 크게 달라집니다. 가업상속공제·세대생략할증·증여세액공제도 반영하지 않았습니다. 참고용 추정치로 보시고 확정은 전문가에게 확인하세요.",
          },
          {
            q: "입력한 재산 정보가 저장되나요?",
            a: "저장되지 않습니다. 모든 계산은 이용자의 브라우저 안에서 이루어지며 서버로 전송되지 않습니다. 회원가입도 없습니다.",
          },
        ]}
        maintained={[
          "상속세율 10~50% 5구간 — 상속세 및 증여세법 제26조",
          "일괄공제 5억 · 기초공제 2억 · 자녀공제 5천만원 (상향안 부결, 현행 유지)",
          "배우자상속공제 최소 5억 · 한도 30억",
          "금융재산상속공제 한도 2억 · 동거주택상속공제 한도 6억",
          "신고세액공제 3% · 신고기한 6개월(국외 9개월)",
          "상속 취득세 2.8% · 무주택 주택 상속 0.8% — 지방세법 제11조",
        ]}
      />

      <AdSlot slot="home-bottom" />
    </div>
  );
}
