import { useState } from "react";
import type { ColumnType } from "./retroBoard";
import { RetroCard } from "./retroCard";

type Props = {
  column: ColumnType;
  onAdd: (columnId: string, text: string) => void;
  onVote: (columnId: string, cardId: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
};

export const RetroColumn = ({ column, onAdd, onVote, onDelete }: Props) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(column.id, text);
    setText("");
  };

  return (
    <div className="column">
      <h3>{column.title}</h3>

      <div className="cards">
        {column.cards.map(card => (
          <RetroCard
            key={card.id}
            card={card}
            onVote={() => onVote(column.id, card.id)}
            onDelete={() => onDelete(column.id, card.id)}
          />
        ))}
      </div>

      <div className="addCard">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Dodaj kartę..."
        />
        <button onClick={handleAdd}>+</button>
      </div>
    </div>
  );
};
