export default function SearchBar() {
  const placeholders = [
    "Tree farm",
    "Egg dropper",
    "Creeper farm",
    "Bedrock breaker",
    "Monostable AND gate",
    "Quarry",
    "Instant wire",
    "Chunk loader",
    "Villager hall"
  ];
  const placeholder = `${placeholders[Math.round(Math.random() * placeholders.length)]}...`;

  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder}/>
    </div>
  );
}
