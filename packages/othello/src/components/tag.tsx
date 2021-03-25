type TagType = "redstone"
  | "slimestone"
  | "storage"
  | "farms"
  | "mob-farms"
  | "bedrock"
  | "computational"
  | "other"
  | string;

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
