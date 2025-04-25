import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";

export default function PostList(props: Lume.Data) {
  const { title, pubDate, tags, url } = props;

  const parsedDate = (() => {
    if (typeof pubDate === "undefined") {
      return "";
    }
    return parse(pubDate, "yyyy-MM-dd", new Date());
  })();

  const formattedDate = format(parsedDate, "M/d", { locale: ja });

  const displayTags = tags.filter((tag) => tag !== "posts");

  return (
    <div className="w-full mb-4 p-4 hover:bg-base-200/50 dark:hover:bg-base-300/30 rounded-md">
      {" "}
      <div className="flex flex-row justify-between items-center gap-4">
        <h2 className="text-lg md:text-xl font-medium">
          <a href={url} className="hover:text-accent dark:hover:text-accent">
            {title}
          </a>
        </h2>
        <div className="flex-shrink-0 text-sm font-mono text-gray-500 dark:text-gray-400">
          {formattedDate}
        </div>
      </div>
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="border border-current opacity-70 px-2 py-1 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
