import Markdown from "react-markdown";

type MarkdownRenderProps = {
  content: string;
};

export const MarkdownRender: React.FC<MarkdownRenderProps> = (props) => {
  return <Markdown>{props.content}</Markdown>;
};
