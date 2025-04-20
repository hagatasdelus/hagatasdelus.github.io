import SocialList from "./SocialList.tsx";

export default function Footer() {
  return (
    <footer className="border-t-2 border-accent text-gray-500 dark:text-gray-300 text-xs px-8 md:px-12 lg:px-16 pt-2 flex flex-col gap-1 justify-between w-full mt-auto">
      <div className="container mx-auto">
        <p className="flex justify-end">
          <a
            href="/info"
            className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent underline decoration-dashed underline-offset-4 transition-colors"
          >
            CC BY-SA 4.0
          </a>
          <span>&nbsp;2025-PRESENT &copy;&nbsp;</span>
          <a
            href="/about"
            className="text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent underline decoration-dashed underline-offset-4 transition-colors"
          >
            Hagata
          </a>
          <span>. All rights reserved.</span>
        </p>
        <ul className="flex justify-end list-none p-0 space-x-4">
          <SocialList />
        </ul>
      </div>
    </footer>
  );
}
