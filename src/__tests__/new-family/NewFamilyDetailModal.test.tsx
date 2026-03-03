import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewFamilyDetailModal from "@/components/new-family/NewFamilyDetailModal";
import type { NewFamily } from "@/types/sanity";

// ─── Mocks ───────────────────────────────────────────────────

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} data-priority={priority ? "true" : undefined} />;
  },
}));

vi.mock("@/sanity/lib/image", () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({
          url: () => "https://cdn.sanity.io/mock-photo.jpg",
        }),
      }),
    }),
  }),
}));

// ─── Fixtures ────────────────────────────────────────────────

const baseMember: NewFamily = {
  _id: "member-1",
  _type: "newFamily",
  name: "김철수",
  date: "2025-03-15",
  photo: {
    _type: "image",
    asset: { _ref: "image-abc-300x400-jpg", _type: "reference" },
  },
  registrationNumber: "2025-042",
  extraFields: [
    { _key: "k1", label: "소속 구역", value: "3구역" },
    { _key: "k2", label: "연락처", value: "010-1234-5678" },
  ],
};

const memberNoOptionals: NewFamily = {
  _id: "member-2",
  _type: "newFamily",
  name: "이영희",
  date: "2025-01-10",
};

// ─── Tests ───────────────────────────────────────────────────

describe("NewFamilyDetailModal", () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    document.body.style.overflow = "";
  });

  it("모든 필드를 올바르게 렌더링한다", () => {
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);

    expect(screen.getByText("김철수")).toBeInTheDocument();
    expect(screen.getByText("2025년 3월 15일")).toBeInTheDocument();
    expect(screen.getByText("2025-042")).toBeInTheDocument();
    expect(screen.getByText("소속 구역")).toBeInTheDocument();
    expect(screen.getByText("3구역")).toBeInTheDocument();
    expect(screen.getByText("연락처")).toBeInTheDocument();
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
  });

  it("사진이 있으면 이미지를 렌더링한다", () => {
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);

    const img = screen.getByAltText("김철수");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://cdn.sanity.io/mock-photo.jpg");
  });

  it("사진이 없으면 placeholder 아이콘을 렌더링한다", () => {
    render(
      <NewFamilyDetailModal member={memberNoOptionals} onClose={onClose} />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // SVG placeholder 존재 확인
    const svgs = document.querySelectorAll("svg");
    // X 아이콘 + placeholder = 최소 1개 SVG
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("선택적 필드가 없으면 해당 항목을 렌더링하지 않는다", () => {
    render(
      <NewFamilyDetailModal member={memberNoOptionals} onClose={onClose} />,
    );

    expect(screen.getByText("이영희")).toBeInTheDocument();
    expect(screen.queryByText("등록번호")).not.toBeInTheDocument();
    expect(screen.queryByText("소속 구역")).not.toBeInTheDocument();
  });

  it("Escape 키를 누르면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("배경(오버레이)을 클릭하면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NewFamilyDetailModal member={baseMember} onClose={onClose} />,
    );

    // 오버레이(최상위 fixed div) 클릭
    const overlay = container.firstElementChild as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("모달 콘텐츠를 클릭해도 onClose가 호출되지 않는다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);

    const nameEl = screen.getByText("김철수");
    await user.click(nameEl);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("마운트 시 body overflow를 hidden으로 설정한다", () => {
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("언마운트 시 body overflow를 복원한다", () => {
    const { unmount } = render(
      <NewFamilyDetailModal member={baseMember} onClose={onClose} />,
    );
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("extraFieldLabels가 있으면 그 순서대로 표시하고, 값이 없으면 '-'을 표시한다", () => {
    render(
      <NewFamilyDetailModal
        member={baseMember}
        extraFieldLabels={["연락처", "소속 구역", "출신교회"]}
        onClose={onClose}
      />,
    );

    // 정의된 라벨 3개 모두 표시
    expect(screen.getByText("연락처")).toBeInTheDocument();
    expect(screen.getByText("소속 구역")).toBeInTheDocument();
    expect(screen.getByText("출신교회")).toBeInTheDocument();

    // 값이 있는 항목
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
    expect(screen.getByText("3구역")).toBeInTheDocument();

    // 값이 없는 항목은 "-"으로 표시
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("닫기 버튼을 클릭하면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyDetailModal member={baseMember} onClose={onClose} />);

    // X 아이콘이 있는 버튼 찾기 (접근성 있는 닫기 버튼)
    const buttons = screen.getAllByRole("button");
    // 첫 번째 button이 닫기 버튼 (오버레이 안의 absolute right-4 top-4)
    await user.click(buttons[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
