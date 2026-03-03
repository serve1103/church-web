import { describe, it, expect } from "vitest";
import { newFamilySettingsQuery } from "@/sanity/lib/queries";

describe("newFamilySettingsQuery", () => {
  it("쿼리가 정의되어 있다", () => {
    expect(newFamilySettingsQuery).toBeDefined();
    expect(typeof newFamilySettingsQuery).toBe("string");
  });

  it("newFamilySettings 타입을 조회한다", () => {
    expect(newFamilySettingsQuery).toContain('_type == "newFamilySettings"');
  });

  it("싱글톤 패턴([0])을 사용한다", () => {
    expect(newFamilySettingsQuery).toContain("[0]");
  });

  it("welcomeMessage 필드를 포함한다", () => {
    expect(newFamilySettingsQuery).toContain("welcomeMessage");
  });

  it("registrationSteps 필드를 포함한다", () => {
    expect(newFamilySettingsQuery).toContain("registrationSteps");
  });

  it("extraFieldLabels 필드를 포함한다", () => {
    expect(newFamilySettingsQuery).toContain("extraFieldLabels");
  });

  it("assignedStaff를 디레퍼런스(->)한다", () => {
    expect(newFamilySettingsQuery).toContain("assignedStaff[]->");
  });

  it("Staff의 필수 필드(name, position, photo)를 프로젝션한다", () => {
    expect(newFamilySettingsQuery).toContain("name");
    expect(newFamilySettingsQuery).toContain("position");
    expect(newFamilySettingsQuery).toContain("photo");
  });
});
