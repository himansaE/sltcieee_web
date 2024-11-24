import type { FC } from "react";
import { DialogButton, usePublisher } from "@mdxeditor/editor";
import { insertDirective$ } from "@mdxeditor/editor";
import type { LeafDirective } from "mdast-util-directive";
import { toast } from "sonner";
import { Youtube } from "lucide-react";

export const YouTubeButton: FC = () => {
  const insertDirective = usePublisher(insertDirective$);

  return (
    <DialogButton
      tooltipTitle="Insert Youtube video"
      submitButtonTitle="Insert video"
      dialogInputPlaceholder="Paste the youtube video URL"
      buttonContent={<Youtube />}
      onSubmit={(url) => {
        try {
          const videoId = new URL(url).searchParams.get("v");
          if (videoId) {
            insertDirective({
              name: "youtube",
              type: "leafDirective",
              attributes: { id: videoId },
              children: [],
            } as LeafDirective);
          } else {
            toast.error("Invalid YouTube URL");
          }
        } catch (e) {
          console.log(e);
          toast.error("Please enter a valid URL");
        }
      }}
    />
  );
};

export default YouTubeButton;
