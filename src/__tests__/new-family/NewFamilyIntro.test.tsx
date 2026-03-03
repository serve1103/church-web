import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NewFamilyIntro from "@/components/new-family/NewFamilyIntro";
import type { NewFamilySettings, Staff } from "@/types/sanity";

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
        url: () => "https://cdn.sanity.io/mock-staff.jpg",
      }),
    }),
  }),
}));

vi.mock("next-sanity", () => ({
  PortableText: ({ value }: { value: unknown[] }) => (
    <div data-testid="portable-text">{JSON.stringify(value)}</div>
  ),
}));

// ─── Fixtures ────────────────────────────────────────────────

const staffMembers: Staff[] = [
  {
    _id: "staff-1",
    _type: "staff",
    name: "박목사",
    position: "부목사",
    photo: {
      _type: "image",
      asset: { _ref: "img-staff-1", _type: "reference" },
    },
  },
  {
    _id: "staff-2",
    _type: "staff",
    name: "김전도사",
    position: "전도사",
  },
];

const fullSettings: NewFamilySettings = {
  welcomeMessage: [
    {
      _type: "block",
      _key: "b1",
      children: [{ _type: "span", text: "환영합니다!" }],
      style: "normal",
      markDefs: [],
    },
  ],
  registrationSteps: [
    {
      _key: "s1",
      stepNumber: 1,
      title: "새가족실 방문",
      description: "예배 후 새가족실을 방문해주세요.",
    },
    {
      _key: "s2",
      stepNumber: 2,
      title: "새가족 교육",
      description: "4주 과정의 새가족 교육에 참여합니다.",
    },
    {
      _key: "s3",
      stepNumber: 3,
      title: "등록 완료",
    },
  ],
  assignedStaff: staffMembers,
};

// ─── Tests ───────────────────────────────────────────────────

describe("NewFamilyIntro", () => {
  it("settings가 null이면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<NewFamilyIntro settings={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("모든 필드가 비어있으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <NewFamilyIntro settings={{}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("환영 인사말 섹션을 렌더링한다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);
    expect(screen.getByTestId("portable-text")).toBeInTheDocument();
  });

  it("등록 절차 섹션을 렌더링한다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);

    expect(screen.getByText("등록 절차")).toBeInTheDocument();
    expect(screen.getByText("새가족실 방문")).toBeInTheDocument();
    expect(screen.getByText("예배 후 새가족실을 방문해주세요.")).toBeInTheDocument();
    expect(screen.getByText("새가족 교육")).toBeInTheDocument();
    expect(screen.getByText("등록 완료")).toBeInTheDocument();

    // 번호 뱃지 확인
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("등록 절차에서 description이 없는 항목은 설명을 렌더링하지 않는다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);

    // "등록 완료" 단계는 description이 없음
    const stepCard = screen.getByText("등록 완료").closest("div");
    expect(stepCard).toBeInTheDocument();
    // 단계 3의 설명 p 태그가 없어야 함
    const descPs = stepCard?.querySelectorAll("p");
    expect(descPs?.length ?? 0).toBe(0);
  });

  it("담당 교역자 섹션을 렌더링한다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);

    expect(screen.getByText("담당 교역자")).toBeInTheDocument();
    expect(screen.getByText("박목사")).toBeInTheDocument();
    expect(screen.getByText("부목사")).toBeInTheDocument();
    expect(screen.getByText("김전도사")).toBeInTheDocument();
    expect(screen.getByText("전도사")).toBeInTheDocument();
  });

  it("사진이 있는 교역자는 이미지를 렌더링한다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);

    const img = screen.getByAltText("박목사");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://cdn.sanity.io/mock-staff.jpg");
  });

  it("사진이 없는 교역자는 이름 첫 글자를 표시한다", () => {
    render(<NewFamilyIntro settings={fullSettings} />);

    // 김전도사의 fallback: "김"
    expect(screen.getByText("김")).toBeInTheDocument();
  });

  it("환영 인사말만 있을 때 해당 섹션만 렌더링한다", () => {
    render(
      <NewFamilyIntro
        settings={{ welcomeMessage: fullSettings.welcomeMessage }}
      />,
    );

    expect(screen.getByTestId("portable-text")).toBeInTheDocument();
    expect(screen.queryByText("등록 절차")).not.toBeInTheDocument();
    expect(screen.queryByText("담당 교역자")).not.toBeInTheDocument();
  });

  it("등록 절차만 있을 때 해당 섹션만 렌더링한다", () => {
    render(
      <NewFamilyIntro
        settings={{ registrationSteps: fullSettings.registrationSteps }}
      />,
    );

    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();
    expect(screen.getByText("등록 절차")).toBeInTheDocument();
    expect(screen.queryByText("담당 교역자")).not.toBeInTheDocument();
  });

  it("담당 교역자만 있을 때 해당 섹션만 렌더링한다", () => {
    render(
      <NewFamilyIntro
        settings={{ assignedStaff: fullSettings.assignedStaff }}
      />,
    );

    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();
    expect(screen.queryByText("등록 절차")).not.toBeInTheDocument();
    expect(screen.getByText("담당 교역자")).toBeInTheDocument();
  });
});
