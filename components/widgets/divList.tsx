import React from "react";

type DivListProps = {
  count: number;
};
export const DivList: React.FC<DivListProps> = (props) => {
  return (
    <>
      {Array.from({ length: props.count }, (_, i) => (
        <div key={i}></div>
      ))}
    </>
  );
};
