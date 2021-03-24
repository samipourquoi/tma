export default function TagList() {
  const tags: {
    emoji: string,
    name: string
  }[] = [
    { emoji: "⚡️", name: "Redstone"       },
    { emoji: "🐸", name: "Slimestone"     },
    { emoji: "💾", name: "Storage"        },
    { emoji: "🚜", name: "Farms"          },
    { emoji: "🐲", name: "Mob farms"      },
    { emoji: "💥", name: "Bedrock break." },
    { emoji: "📺", name: "Computational"  },
    { emoji: "🌈", name: "Other"          }
  ];

  return (
    <ul className="tag-list">
      {tags.map(tag => (
        <li key={tag.name}>
          <span>{tag.emoji}</span>
          <span className="tag-name">{tag.name}</span>
        </li>
      ))}
    </ul>
  )
}
