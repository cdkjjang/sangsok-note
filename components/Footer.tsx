import Link from "next/link";
import FamilyLinks from "@/components/FamilyLinks";
import { SITE_NAME } from "@/lib/site";

const TOOL_LINKS = [
  { href: "/calc/tax", label: "상속세 계산기" },
  { href: "/calc/share", label: "법정상속분" },
  { href: "/calc/deadline", label: "상속 기한 D-day" },
  { href: "/calc/registration", label: "상속등기 비용" },
  { href: "/guide", label: "상속 가이드" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft bg-card">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">
        <nav aria-label="사이트 바로가기" className="mb-5">
          <p className="mb-2 font-semibold text-foreground">{SITE_NAME} 도구</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {TOOL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <FamilyLinks />
        <p className="mb-3">
          {SITE_NAME}의 계산 결과는 상속세 및 증여세법·민법·지방세법 등 공개된
          기준을 정리한 참고용 추정치이며, 세무·법률 자문이 아닙니다. 재산 평가
          방식과 개별 사정에 따라 실제 세액과 상속분이 달라질 수 있습니다.
          상속세는 국세상담센터(126), 취득세는 관할 시·군·구청, 법률 문제는
          대한법률구조공단(132)에서 최종 확인하세요.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/editorial" className="hover:text-accent">
            편집 원칙
          </Link>
          <Link href="/contact" className="hover:text-accent">
            문의
          </Link>
          <Link href="/terms" className="hover:text-accent">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
