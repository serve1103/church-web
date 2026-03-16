import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary/20">404</p>
        <h2 className="mt-4 text-2xl font-bold text-text">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-3 text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
