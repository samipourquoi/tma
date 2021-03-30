import { TagType } from "hamlet/api";

export interface TagProps {
  type: TagType,
  onDelete?(): void;
}

export default function Tag({ type, onDelete }: TagProps) {
  return (
    <span className={`tag ${type}-tag`}>
      {typeToName(type)}
      {onDelete ?
        <span className="material-icons" onClick={onDelete}>
          clear
        </span> :

        null}
    </span>
  )
}

function typeToName(type: TagType):
  string
{
  return ({
    "mob-farms": "mob farms",
    "bedrock": "bedrock break."
  } as unknown as {
    [k: string]: string
  })[type] || type;
}
