import { useParams } from "react-router-dom";
import { Timer } from "../components/timer/timer";
import { RetroBoard } from "../components/retro/retroBoard";

export const RetrospectiveBoard = () => {
  const { id } = useParams();

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 12,
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Retrospektywa {id}</h2>
        <Timer />
      </div>

      <div>
        <RetroBoard />
      </div>
    </div>
  );
};
