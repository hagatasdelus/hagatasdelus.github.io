import { SITE_TITLE } from "../../consts.ts";
import { encodeBase64 } from "jsr:@std/encoding/base64";

const ogImage = await Deno.readFile("./static/ogp/ogimage.png");
const base64ImageSource = `data:image/png;base64,${encodeBase64(ogImage)}`;

export default function ({
  title,
  tags = [],
}: {
  title: string;
  tags?: string[];
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${base64ImageSource})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          width: "90%",
          height: "90%",
          borderRadius: 20,
          margin: "auto",
        }}
      >
        <div
          style={{
            fontSize: 60,
            color: "#000",
            lineHeight: 1.3,
            textAlign: "left",
            fontFamily: "NotoSansJPBlack",
            fontWeight: 900,
            padding: 50,
            paddingBottom: 30,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "flex-start",
            paddingLeft: 50,
          }}
        >
          {tags.length > 0 &&
            tags
              .filter((tag) => tag !== "posts")
              .map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    padding: "8px 20px",
                    borderRadius: 12,
                    fontSize: 24,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "NotoSansJPBold",
            fontWeight: 800,
            marginTop: "auto",
            padding: 50,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src="https://avatars.githubusercontent.com/u/110240247?v=4"
              width={80}
              height={80}
              style={{
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: 45,
                color: "#000",
              }}
            >
              Hagata
            </span>
          </div>
          <span
            style={{
              fontSize: 45,
              color: "#000",
            }}
          >
            {SITE_TITLE}
          </span>
        </div>
      </div>
    </div>
  );
}
