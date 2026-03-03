import { describe, it, expect } from "vitest";
import { newFamilySettings } from "@/sanity/schemas/newFamilySettings";

describe("newFamilySettings 스키마", () => {
  it("올바른 이름과 타입을 가진다", () => {
    expect(newFamilySettings.name).toBe("newFamilySettings");
    expect(newFamilySettings.type).toBe("document");
  });

  it("필수 필드 5개를 정의한다", () => {
    const fieldNames = newFamilySettings.fields.map((f) => f.name);
    expect(fieldNames).toContain("displayMonths");
    expect(fieldNames).toContain("welcomeMessage");
    expect(fieldNames).toContain("registrationSteps");
    expect(fieldNames).toContain("extraFieldLabels");
    expect(fieldNames).toContain("assignedStaff");
  });

  it("welcomeMessage는 portableText 타입이다", () => {
    const field = newFamilySettings.fields.find(
      (f) => f.name === "welcomeMessage",
    );
    expect(field?.type).toBe("portableText");
  });

  it("registrationSteps는 array 타입이다", () => {
    const field = newFamilySettings.fields.find(
      (f) => f.name === "registrationSteps",
    );
    expect(field?.type).toBe("array");
  });

  it("assignedStaff는 reference 배열이다", () => {
    const field = newFamilySettings.fields.find(
      (f) => f.name === "assignedStaff",
    );
    expect(field?.type).toBe("array");
  });

  it("preview에서 '새가족 설정'을 반환한다", () => {
    const preview = newFamilySettings.preview;
    expect(preview).toBeDefined();
    if (preview && "prepare" in preview && typeof preview.prepare === "function") {
      const result = preview.prepare({});
      expect(result).toEqual({ title: "새가족 설정" });
    }
  });
});
