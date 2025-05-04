import SocialList from "./SocialList.tsx";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer>
      <div className="mx-6">
        <div className="border-t-2 border-accent">
          <div className="container mx-auto my-1.5 px-4 md:px-8 lg:px-12 max-w-5xl">
            <div className="flex justify-end h-16 items-center">
              <section className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
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
                <ul className="flex justify-end list-none space-x-4 mt-1">
                  <SocialList />
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
