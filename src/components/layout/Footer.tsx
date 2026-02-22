import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">남문교회</h3>
            <ul className="space-y-2 text-sm">
              <li>주소: 경남 진주시 남문동 (상세 주소는 Sanity에서 관리)</li>
              <li>전화: 055-000-0000</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">바로가기</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 남문교회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
