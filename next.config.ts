import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    return [
      // 교회 소개 하위
      { source: "/church", destination: "/about", permanent: true },
      { source: "/history", destination: "/about", permanent: true },
      { source: "/worship", destination: "/about", permanent: true },
      { source: "/staff", destination: "/about", permanent: true },
      { source: "/map", destination: "/about", permanent: true },
      { source: "/directions", destination: "/about", permanent: true },
      // 설교
      { source: "/Sunday01", destination: "/sermons", permanent: true },
      // 소식
      { source: "/notice", destination: "/notices", permanent: true },
      { source: "/jubo", destination: "/bulletins", permanent: true },
      // 영향력 공동체
      { source: "/newfamily", destination: "/community", permanent: true },
      // 세움 공동체
      { source: "/nm01", destination: "/community", permanent: true },
      { source: "/nm02", destination: "/community", permanent: true },
      { source: "/nm03", destination: "/community", permanent: true },
      { source: "/nm04", destination: "/community", permanent: true },
      { source: "/nm06", destination: "/community", permanent: true },
      // 기타
      { source: "/column", destination: "/", permanent: true },
      { source: "/greeting", destination: "/", permanent: true },
      { source: "/partworship", destination: "/", permanent: true },
      { source: "/bible", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
