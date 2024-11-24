import type { LeafDirective } from "mdast-util-directive";
import type { DirectiveDescriptor } from "@mdxeditor/editor";
import { YouTubeEmbed } from "@next/third-parties/google";

interface YoutubeDirectiveNode extends LeafDirective {
  name: "youtube";
  attributes: { id: string };
}

export const YoutubeDirectiveDescriptor: DirectiveDescriptor<YoutubeDirectiveNode> =
  {
    name: "youtube",
    type: "leafDirective",
    testNode(node) {
      return node.name === "youtube";
    },
    attributes: ["id"],
    hasChildren: false,
    Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
      const opts = {
        height: 315,
        width: 560,
        playerVars: {
          autoplay: 0,
        },
      };

      const playerParams = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        showinfo: "0",
        controls: "1",
        enablejsapi: "1",
        loading: "lazy",
      }).toString();

      return (
        <div className="flex flex-col items-start gap-2">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            className="text-sm text-red-500 hover:text-red-700"
            onClick={() => {
              parentEditor.update(() => {
                lexicalNode.selectNext();
                lexicalNode.remove();
              });
            }}
          >
            Delete
          </button>
          <YouTubeEmbed
            videoid={mdastNode.attributes.id}
            height={opts.height}
            width={opts.width}
            params={playerParams}
            style="border: 1px solid #ccc; margin: 0 auto; border-radius: 4px;"
          />
        </div>
      );
    },
  };
