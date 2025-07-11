type Player = {
  id: number;
  name: string;
  position: string;
  age: number;
};

export default function TeamSquad({ players }: { players: Player[] }) {
  return (
    <ul className="divide-y divide-[#2c2c2e]">
      {players.map((p) => (
        <li key={p.id} className="py-3 flex justify-between items-center">
          <span>{p.name}</span>
          <span className="text-sm text-gray-400">{p.position}, {p.age} y/o</span>
        </li>
      ))}
    </ul>
  );
}
