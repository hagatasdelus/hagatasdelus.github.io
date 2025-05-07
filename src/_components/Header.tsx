import { SITE_TITLE } from "../consts.ts";
import { SunIcon, MoonIcon } from "./ThemeIcons.tsx";

const navigation = [
  { name: "About", href: "/about/" },
  { name: "Info", href: "/info/" },
  { name: "Blog", href: "/blog/" },
  { name: "Misc", href: "/misc/" },
];

const linkStyle =
  "text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent";

export default function Header() {
  return (
    <header>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl">
        <nav className="grid grid-cols-[auto_1fr] items-center h-16">
          <div className="text-2xl font-bold">
            <a href="/" className={linkStyle}>
              {SITE_TITLE}
            </a>
          </div>

          <div className="justify-self-end flex items-center space-x-4">
            <div
              id="theme-toggle"
              className={`cursor-pointer p-2 ${linkStyle}`}
              aria-label="テーマ切替"
            >
              <span className="relative inline-block w-6 h-6">
                <span id="sun-icon" className="absolute inset-0 theme-icon">
                  <SunIcon />
                </span>
                <span
                  id="moon-icon"
                  className="absolute inset-0 hidden theme-icon"
                >
                  <MoonIcon />
                </span>
              </span>
            </div>

            <div className="md:hidden relative p-2">
              <input
                type="checkbox"
                id="menu-toggle"
                className="hidden peer"
                aria-hidden="true"
              />

              <label
                htmlFor="menu-toggle"
                className={`cursor-pointer ${linkStyle}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>

              <label
                htmlFor="menu-toggle"
                className="fixed inset-0 z-10 hidden peer-checked:block"
                aria-hidden="true"
              />

              <ul
                className="absolute right-0 top-full p-2 w-32 z-20 bg-base-100 dark:bg-base-300 rounded-lg shadow-lg hidden peer-checked:block"
                role="menu"
              >
                {navigation.map((item) => (
                  <li key={item.name} className="py-2 px-4">
                    <label htmlFor="menu-toggle" className="cursor-pointer">
                      <a href={item.href} className={linkStyle}>
                        {item.name}
                      </a>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className={linkStyle}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
