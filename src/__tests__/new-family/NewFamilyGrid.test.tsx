import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import NewFamilyGrid from "@/components/new-family/NewFamilyGrid";
import type { NewFamily } from "@/types/sanity";

// ─── Mocks ───────────────────────────────────────────────────

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} />;
  },
}));

vi.mock("@/sanity/lib/image", () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({
          url: () => "https://cdn.sanity.io/mock.jpg",
        }),
      }),
    }),
  }),
}));

// ─── Fixtures ────────────────────────────────────────────────

const members: NewFamily[] = [
  {
    _id: "m1",
    _type: "newFamily",
    name: "홍길동",
    date: "2025-01-01",
    photo: {
      _type: "image",
      asset: { _ref: "img-1", _type: "reference" },
    },
    registrationNumber: "2025-001",
    extraFields: [{ _key: "k1", label: "구역", value: "1구역" }],
  },
  {
    _id: "m2",
    _type: "newFamily",
    name: "김영수",
    date: "2025-02-15",
  },
  {
    _id: "m3",
    _type: "newFamily",
    name: "박지은",
    date: "2025-03-10",
    photo: {
      _type: "image",
      asset: { _ref: "img-3", _type: "reference" },
    },
  },
];

// ─── Tests ───────────────────────────────────────────────────

describe("NewFamilyGrid", () => {
  it("멤버가 없으면 빈 상태 메시지를 표시한다", () => {
    render(<NewFamilyGrid members={[]} />);
    expect(screen.getByText("등록된 새가족이 없습니다.")).toBeInTheDocument();
  });

  it("멤버 이름만 표시하고 등록번호는 표시하지 않는다", () => {
    render(<NewFamilyGrid members={members} />);

    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("김영수")).toBeInTheDocument();
    expect(screen.getByText("박지은")).toBeInTheDocument();

    // 등록번호는 카드에 표시하지 않음
    expect(screen.queryByText("2025-001")).not.toBeInTheDocument();
  });

  it("각 멤버가 클릭 가능한 button으로 렌더링된다", () => {
    render(<NewFamilyGrid members={members} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("사진이 있는 멤버는 이미지를 렌더링한다", () => {
    render(<NewFamilyGrid members={members} />);

    const images = screen.getAllByRole("img");
    // 홍길동, 박지은 = 2명만 사진 있음
    expect(images).toHaveLength(2);
  });

  it("카드 클릭 시 모달이 열린다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyGrid members={members} />);

    // 홍길동 카드 클릭
    await user.click(screen.getByText("홍길동"));

    // 모달에 이름이 제목으로 한 번 더 나타남 (카드 + 모달)
    const allNames = screen.getAllByText("홍길동");
    expect(allNames.length).toBeGreaterThanOrEqual(2);

    // 모달에서 등록번호가 표시됨
    expect(screen.getByText("2025-001")).toBeInTheDocument();
    expect(screen.getByText("구역")).toBeInTheDocument();
    expect(screen.getByText("1구역")).toBeInTheDocument();
  });

  it("모달에서 Escape를 누르면 닫힌다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyGrid members={members} />);

    // 카드 클릭 → 모달 열기
    await user.click(screen.getByText("홍길동"));
    expect(screen.getByText("2025-001")).toBeInTheDocument();

    // Escape로 닫기
    await user.keyboard("{Escape}");

    // 등록번호가 사라졌으면 모달이 닫힌 것
    expect(screen.queryByText("2025-001")).not.toBeInTheDocument();
  });

  it("다른 멤버 카드를 클릭하면 해당 멤버의 모달이 열린다", async () => {
    const user = userEvent.setup();
    render(<NewFamilyGrid members={members} />);

    // 김영수(사진/등록번호 없는 멤버) 클릭
    await user.click(screen.getByText("김영수"));

    // 모달에 김영수 이름 표시
    const allNames = screen.getAllByText("김영수");
    expect(allNames.length).toBeGreaterThanOrEqual(2);

    // 등록번호가 없으므로 표시 안 됨
    expect(screen.queryByText("등록번호")).not.toBeInTheDocument();
  });
});
