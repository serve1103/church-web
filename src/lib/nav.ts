/**
 * 현재 경로가 주어진 nav 링크에 매칭되는지 판별
 */
export const isNavActive = (pathname: string, href: string): boolean => {
  const basePath = href.split("#")[0];
  if (basePath === "/") return pathname === "/";
  return pathname === basePath || pathname.startsWith(basePath + "/");
};
