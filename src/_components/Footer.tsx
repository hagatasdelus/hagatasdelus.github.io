import SocialList from "./SocialList.tsx";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t-2 border-accent text-gray-500 dark:text-gray-300 text-xs px-8 md:px-12 lg:px-16 pt-2 w-full mt-auto">
      <div className="container mx-auto">
        <div className="text-right">
          <p>
            <span>Copyright&nbsp;&copy;&nbsp;{currentYear}&nbsp;</span>
            <a
              href="/about"
              className="hover:text-accent dark:hover:text-accent underline decoration-dashed underline-offset-4"
            >
              Hagata
            </a>
            <span>.&nbsp;All rights reserved.</span>
          </p>
        </div>
        <ul className="flex justify-end list-none p-0 space-x-4">
          <SocialList />
        </ul>
      </div>
    </footer>
  );
}
