import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RetroColumn } from "./retroColumn";
import { getRetro, saveRetro } from "../../api/retro";
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
  const { id } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    if (id) {
      getRetro(id).then(res => setColumns(res.data.columns)).catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (id && columns.length) {
      const timer = setTimeout(() => {
        saveRetro(id, columns).then(() => console.log('✅ Zapisano')).catch(console.error);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [columns, id]);

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
