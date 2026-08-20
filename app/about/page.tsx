import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "상속노트는 상속세와 법정상속분, 상속 관련 기한 D-day, 상속등기 비용을 계산기와 가이드로 정리한 생활 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 상속이 시작됐을 때 확인해야 할 것들을 정리한 무료 도구
        모음입니다. 상속세가 나오는지, 법정상속분은 어떻게 나뉘는지, 언제까지
        무엇을 해야 하는지, 상속등기에 얼마가 드는지를 몇 가지 값만 넣어 바로
        계산합니다.
      </p>
      <p>
        상속에서 가장 위험한 것은 <strong>기한</strong>입니다. 상속을 안 날로부터
        3개월이 지나면 단순승인으로 확정되어, 아무것도 하지 않았을 뿐인데 빚까지
        물려받습니다. 상속세 신고는 사망한 달의 말일부터 6개월입니다.{" "}
        <strong>이 기한들은 놓치면 되돌릴 방법이 없습니다.</strong> 이 사이트가
        금액뿐 아니라 날짜를 함께 보여주는 이유입니다.
      </p>
      <p>
        모든 계산은 상속세 및 증여세법, 민법 상속편, 지방세법 등 공개된 기준을
        근거로 합니다. 각 계산기 페이지에 어떤 조문을 적용했는지 함께 표기하고,
        기준이 개정되면 계산 로직과 설명을 함께 갱신한 뒤 갱신일을 표시합니다.
        세율과 공제액 자체를 숫자로 고정하는 검증 테스트를 두어, 값이 낡으면
        테스트가 먼저 실패하도록 해 두었습니다.
      </p>
      <p>
        이 사이트의 계산은 <strong>참고용 추정치</strong>이며 세무·법률 자문이
        아닙니다. 상속재산의 평가와 상속인 확정은 개별 사실관계에 따라 크게
        달라집니다. 특히 상속 포기와 한정승인은 기한이 지나면 되돌릴 수 없으므로,
        빚이 있을 가능성이 조금이라도 있다면 반드시 변호사·법무사와 상담하세요.
        세금은 국세청 국세상담센터(126)에서 확인할 수 있습니다.
      </p>
      <p>
        <strong>확정되지 않은 개편안은 계산에 넣지 않습니다.</strong> 유산취득세
        전환과 자녀공제 상향은 논의만 되고 확정되지 않아 반영하지 않았습니다.
        발표만 된 안을 미리 넣으면 계산기가 틀린 답을 내기 때문입니다. 확정되면
        그때 반영합니다.
      </p>
      <p>
        입력한 재산과 날짜 정보는 이용자의 브라우저 안에서만 계산되며 서버로
        전송·저장되지 않습니다. 회원가입도 없습니다. 문의는{" "}
        <a
          href="mailto:cdkjjang@gmail.com"
          className="text-accent underline-offset-4 hover:underline"
        >
          cdkjjang@gmail.com
        </a>
        으로 보내주세요.
      </p>
      <p>
        {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나입니다.
        세금노트가 증여세를, 부동산노트가 매매 취득세를 다룬다면 이 노트는 상속
        쪽만 맡습니다. 작성 기준과 근거 자료는{" "}
        <Link
          href="/editorial"
          className="text-accent underline-offset-4 hover:underline"
        >
          편집 원칙
        </Link>
        에 공개해 두었습니다.
      </p>
      <p>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          홈으로 →
        </Link>
      </p>
    </div>
  );
}
