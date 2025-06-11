import { SITE_TITLE } from "../../consts.ts";
import { encodeBase64 } from "jsr:@std/encoding/base64";

const ogImage = await Deno.readFile("./src/public/assets/ogp/ogimage.png");
const base64ImageSource = `data:image/png;base64,${encodeBase64(ogImage)}`;

export default function ({ title }: { title: string }) {
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
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 70,
            color: "#000",
            lineHeight: 1.3,
            textAlign: "center",
            fontFamily: "NotoSansJPBlack",
            fontWeight: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "NotoSansJPBold",
            fontWeight: 800,
            position: "absolute",
            bottom: 50,
            left: 50,
            right: 50,
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
          {title !== SITE_TITLE && (
            <span
              style={{
                fontSize: 45,
                color: "#000",
              }}
            >
              {SITE_TITLE}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
