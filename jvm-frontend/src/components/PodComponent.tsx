import React from "react";

interface PodComponentProps {
    pod: string;
    onClick: () => void
}

const colors = ['border-blue-500', 'border-red-500', 'border-green-500', 'border-purple-500'];

const PodComponent = (props: PodComponentProps) => {
  // Generate the color once per render
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  return (
    <div
      onClick={props.onClick}
      className="bg-white shadow-md rounded-lg p-6 mb-6 border-4 cursor-pointer"
      style={{ backgroundColor: randomColor }} // Inline style for dynamic values
    >
      <h3 className="text-lg font-medium">Pod {props.pod}</h3>
    </div>
  );
};


export default PodComponent;