import { groq } from "next-sanity";

// 모든 GROQ 쿼리를 이 파일에서 중앙 관리합니다.
// 컴포넌트에 쿼리를 분산하지 마세요.

export const homePageQuery = groq`*[_type == "page" && slug.current == "home"][0]`;
