import { useState } from "react";
import { RetroColumn } from "./retroColumn";
import "./retro.css";

export type CardType = {
  id: string;
  text: string;
  votes: number;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

export const RetroBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: "good", title: "✅ Poszło dobrze", cards: [] },
    { id: "bad", title: "❌ Problemy", cards: [] },
    { id: "improve", title: "🔧 Do poprawy", cards: [] },
    { id: "actions", title: "🎯 Action items", cards: [] },
  ]);

  const addCard = (columnId: string, text: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: [
                ...col.cards,
                { id: crypto.randomUUID(), text, votes: 0 },
              ],
            }
          : col
      )
    );
  };

  const voteCard = (columnId: string, cardId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map(card =>
                card.id === cardId
                  ? { ...card, votes: card.votes + 1 }
                  : card
              ),
            }
          : col
      )
    );
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter(c => c.id !== cardId),
            }
          : col
      )
    );
  };

  return (
    <div className="board">
      {columns.map(col => (
        <RetroColumn
          key={col.id}
          column={col}
          onAdd={addCard}
          onVote={voteCard}
          onDelete={deleteCard}
        />
      ))}
    </div>
  );
};
