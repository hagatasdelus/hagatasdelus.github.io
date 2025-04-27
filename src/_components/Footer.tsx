import SocialList from "./SocialList.tsx";

export default function Footer() {
  return (
    <footer className="border-t-2 border-accent text-gray-500 dark:text-gray-300 text-xs px-8 md:px-12 lg:px-16 pt-2 w-full mt-auto">
      <div className="container mx-auto">
        <div className="text-right">
          <p>
            <a
              href="/info"
              className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent underline decoration-dashed underline-offset-4"
            >
              CC BY-SA 4.0
            </a>
            <span>&nbsp;2025-PRESENT &copy;&nbsp;</span>
            <a
              href="/about"
              className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent underline decoration-dashed underline-offset-4"
            >
              Hagata
            </a>
            <span>. All rights reserved.</span>
          </p>
        </div>
        <ul className="flex justify-end list-none p-0 space-x-4">
          <SocialList />
        </ul>
      </div>
    </footer>
  );
}
