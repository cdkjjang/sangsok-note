import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <p className="text-5xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">페이지를 찾을 수 없습니다</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        주소가 바뀌었거나 삭제된 페이지입니다. 찾으시던 것이 아래에 있을지도
        몰라요.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        <Link
          href="/calc/tax"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">상속세 계산기</span>
          <span className="block text-sm text-muted">우리 집은 낼 일이 있나</span>
        </Link>
        <Link
          href="/calc/deadline"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">상속 기한 D-day</span>
          <span className="block text-sm text-muted">포기 3개월, 신고 6개월</span>
        </Link>
        <Link
          href="/guide"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">상속 가이드 전체 보기</span>
          <span className="block text-sm text-muted">상속세·상속분·기한·등기</span>
        </Link>
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
      >
        홈으로 가기
      </Link>
    </div>
  );
}