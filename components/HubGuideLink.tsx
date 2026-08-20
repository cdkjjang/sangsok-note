// 생활반장 허브의 상황별 가이드로 연결한다.
// 이 노트 하나로 끝나지 않는 상황(이사·결혼·이직 등)을 순서대로 정리한 글이라,
// 글을 다 읽은 독자에게 자연스러운 다음 단계가 된다.
// 허브가 노트로 보내기만 하고 받지는 못하던 단방향 구조를 메우는 자리이기도 하다.

const HUB = {
  href: "https://lifebanjang.com/guide/family-death-admin",
  title: "가족이 돌아가신 뒤 해야 할 일",
  desc: "사망신고부터 상속·연금·보험 정리까지 순서표",
};

export default function HubGuideLink() {
  return (
    <section className="mt-8 rounded-2xl border border-border-soft bg-card p-5">
      <p className="text-xs font-bold text-accent-strong">이 상황 전체 흐름 보기</p>
      <a
        href={HUB.href}
        className="mt-2 block font-bold leading-snug underline-offset-4 hover:text-accent hover:underline"
      >
        {HUB.title} →
      </a>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{HUB.desc}</p>
      <p className="mt-3 text-xs text-muted">
        생활반장 허브 — 여러 노트에 걸친 상황을 한 번에 정리한 글입니다.
      </p>
    </section>
  );
}