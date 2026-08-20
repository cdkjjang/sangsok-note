import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관·면책조항",
  description: `${SITE_NAME}의 이용약관과 면책조항입니다.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">이용약관·면책조항</h1>
      <p className="text-sm text-muted">시행일: 2026-07-23</p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">1. 서비스의 성격</h2>
        <p>
          {SITE_NAME}는 상속세·법정상속분·상속 관련 기한·상속등기 비용 등 상속
          제도와 관련된 계산기와 정보 콘텐츠를 무료로 제공하는 서비스입니다.
          회원가입 없이 누구나 이용할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">2. 정보의 한계 (면책조항)</h2>
        <p>
          본 사이트의 계산 결과와 콘텐츠는 상속세 및 증여세법, 민법 상속편,
          지방세법 등 공개된 기준을 정리한
          <strong> 일반적인 참고 정보이며, 세무·법률 자문이 아닙니다</strong>.
          특히 상속재산의 평가와 상속인 확정은 개별 사실관계에 따라 달라지므로,
          본 사이트의 결과와 다를 수 있습니다.
        </p>
        <p>
          운영자는 정보의 정확성을 위해 노력하지만, 본 사이트의 정보를 근거로 한
          의사결정의 결과에 대해 법적 책임을 지지 않습니다. 세금은 국세청
          국세상담센터(126)와 홈택스에서, 등기는 대법원 인터넷등기소와 관할
          등기소에서 확인하시기 바랍니다. 상속 포기·한정승인처럼 기한이 지나면
          되돌릴 수 없는 사안은 반드시 변호사·법무사와 상담하세요.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">3. 광고 게재</h2>
        <p>
          본 사이트는 Google 애드센스 등 광고를 게재할 수 있으며, 광고 수익으로
          무료 서비스를 유지합니다. 광고 내용은 광고주가 제공하는 것으로, 본
          사이트가 해당 상품·서비스를 보증하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">4. 저작권</h2>
        <p>
          본 사이트의 콘텐츠(글, 계산 로직, 디자인)의 저작권은 운영자에게
          있습니다. 출처를 밝힌 인용·링크는 자유롭게 하실 수 있으나, 전체
          복제·상업적 무단 이용은 금지됩니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">5. 문의</h2>
        <p>
          약관·서비스 관련 문의는{" "}
          <a href="mailto:cdkjjang@gmail.com" className="text-accent underline-offset-4 hover:underline">
            cdkjjang@gmail.com
          </a>
          으로 보내주세요. 관련 문서:{" "}
          <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">
            개인정보처리방침
          </Link>
        </p>
      </section>
    </div>
  );
}
