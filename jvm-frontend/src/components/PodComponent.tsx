import React from "react";
import { Card } from "@blueprintjs/core";
interface PodComponentProps {
    pod: string;
    onClick: () => void
}


const PodComponent = (props: PodComponentProps) => {
  // Generate the color once per render
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  return (
    <Card
      className="m-2 p-4 cursor-pointer hover:shadow-lg transition-shadow"
      style={{ borderLeft: `6px solid ${randomColor}` }}
      onClick={props.onClick}
    >
      <h3 className="text-lg font-medium">{props.pod}</h3>
    </Card>
  );
};


export default PodComponent;