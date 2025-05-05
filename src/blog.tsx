import { SITE_DESCRIPTION } from "./consts.ts";
import PostList from "./_components/PostList.tsx";

export const layout = "layouts/Base.tsx";
export const title = "Blog";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

interface YearlyPostGroup {
  year: number;
  posts: Lume.Page[];
}

function groupPostsByYear(posts: Lume.Page[]): YearlyPostGroup[] {
  return posts.reduce<YearlyPostGroup[]>((yearGroups, currentPost) => {
    const postYear = new Date(currentPost.pubDate).getFullYear();

    const lastGroupIndex = yearGroups.length - 1;
    const lastYearGroup = yearGroups[lastGroupIndex];

    if (yearGroups.length === 0 || lastYearGroup.year !== postYear) {
      return [
        ...yearGroups,
        {
          year: postYear,
          posts: [currentPost],
        },
      ];
    }

    const updatedGroup = {
      ...lastYearGroup,
      posts: [...lastYearGroup.posts, currentPost],
    };

    return [...yearGroups.slice(0, lastGroupIndex), updatedGroup];
  }, []);
}

export default function ({ search }: Lume.Data, _helpers: Lume.Helpers) {
  const sortedPosts = search
    .pages("posts")
    // .filter((page) => page.published == true)
    .sort((a, b) => {
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB.getTime() - dateA.getTime(); // 降順
    });

  const postsByYear = groupPostsByYear(sortedPosts);

  return (
    <>
      <div className="max-w-2xl mx-auto px-4">
        {/* <div className="search my-8" id="search" /> */}

        <div>
          {postsByYear.map((yearGroup, groupIndex) => (
            <div key={groupIndex}>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4 mt-8 mb-6 first:mt-0">
                <h2 className="text-accent dark:text-accent text-2xl font-bold">
                  {yearGroup.year}
                </h2>
                <div className="h-px bg-accent/30 dark:bg-accent/30"></div>
              </div>

              {yearGroup.posts.map((post, postIndex) => (
                <PostList
                  key={postIndex}
                  title={post.title}
                  pubDate={post.pubDate}
                  tags={post.tags}
                  url={post.url}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
