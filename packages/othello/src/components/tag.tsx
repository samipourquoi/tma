import { TagType } from "hamlet/api";

export interface TagProps {
  type: TagType
}

export default function Tag({ type }: TagProps) {
  return (
    <span className={`tag ${type}-tag`}>
      {typeToName(type)}
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
