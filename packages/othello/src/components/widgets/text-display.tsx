export interface TextDisplayProps {
  display: "any" | string
}

export default function TextDisplay({ display }: TextDisplayProps) {
  return (
    <span className="text-display">
      {display}
    </span>
  );
}
