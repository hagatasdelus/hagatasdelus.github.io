const Search = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M19 11.5a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0m-2.107 5.42l3.08 3.08"
    />
  </svg>
);

export default function () {
  return (
    <>
      <div className="flex justify-end">
        <label
          htmlFor="pagefind_modal"
          className="flex items-center gap-2 px-3 py-1 border rounded-md bg-base-200 hover:bg-base-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 border-gray-500 hover:border-accent transition-all duration-200 w-32 sm:w-40"
        >
          <Search className="flex-shrink-0" />
          <span className="truncate">Search</span>
        </label>
      </div>
      <input
        type="checkbox"
        id="pagefind_modal"
        className="hidden modal-toggle"
        aria-hidden="true"
      />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <div className="flex flex-col h-dvh py-5">
            <div
              id="search"
              className="mx-3 sm:mx-6 md:mx-10 lg:mx-14 xl:mx-16"
            >
              <label
                htmlFor="pagefind_modal"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </label>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="pagefind_modal">
          Close
        </label>
      </div>
    </>
  );
}
