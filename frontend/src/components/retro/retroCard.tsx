import type { CardType } from "./retroBoard";

type Props = {
  card: CardType;
  onVote: () => void;
  onDelete: () => void;
};

export const RetroCard = ({ card, onVote, onDelete }: Props) => {
  return (
    <div className="card">
      <p>{card.text}</p>

      <div className="cardActions">
        <button onClick={onVote}>👍 {card.votes}</button>
        <button onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
};
