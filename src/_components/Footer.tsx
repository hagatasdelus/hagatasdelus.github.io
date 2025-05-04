import SocialList from "./SocialList.tsx";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer>
      <div className="border-t-2 border-accent text-gray-500 dark:text-gray-300 text-xs">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-3">
          <div className="text-right pb-1.5">
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
          <ul className="flex justify-end list-none space-x-4 my-2">
            <SocialList />
          </ul>
        </div>
      </div>
    </footer>
  );
}
