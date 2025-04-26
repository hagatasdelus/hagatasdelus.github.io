import { SITE_TITLE } from "../consts.ts";
import { SunIcon, MoonIcon } from "./ThemeIcons.tsx";

export default function Header() {
  const navigation = [
    { name: "About", href: "/about/" },
    { name: "Info", href: "/info/" },
    { name: "Blog", href: "/blog/" },
    { name: "Misc", href: "/misc/" },
  ];

  return (
    <header className="">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <nav className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold">
            <a
              href="/"
              className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
            >
              {SITE_TITLE}
            </a>
          </h1>

          <div className="flex items-center space-x-4">
            <div
              id="theme-toggle"
              className="cursor-pointer p-2 text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
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

            <div className="md:hidden relative">
              <input
                type="checkbox"
                id="menu-toggle"
                className="hidden peer"
                aria-hidden="true"
              />

              <label
                htmlFor="menu-toggle"
                className="p-2 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent block"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
              ></label>

              <ul
                className="absolute right-0 top-full mt-3 p-2 w-32 z-20 bg-base-100 dark:bg-base-300 rounded-lg shadow-lg hidden peer-checked:block"
                role="menu"
              >
                {navigation.map((item) => (
                  <li key={item.name} className="py-2 px-4">
                    <label
                      htmlFor="menu-toggle"
                      className="block cursor-pointer"
                    >
                      <a
                        href={item.href}
                        className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
                      >
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
                  <a
                    href={item.href}
                    className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
                  >
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
