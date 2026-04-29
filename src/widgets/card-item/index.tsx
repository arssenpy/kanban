import { Card } from "@/entities/card/types";

export function CardItem({ card }: { card: Card }) {
  return <div className="bg-white p-2 rounded shadow">{card.title}</div>;
}
