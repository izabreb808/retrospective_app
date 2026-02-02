import { useEffect, useState } from "react";
import "./timer.css";

export const Timer = () => {
  const [seconds, setSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // format mm:ss
  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const setPreset = (min: number) => {
    setIsRunning(false);
    setSeconds(min * 60);
  };

  return (
    <div className="timer">
      <div className={`time ${seconds <= 15 ? "danger" : ""}`}>
        {formatTime()}
      </div>

      <div className="controls">
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => setPreset(5)}>5m</button>
        <button onClick={() => setPreset(10)}>10m</button>
        <button onClick={() => setPreset(15)}>15m</button>
        <button onClick={() => setPreset(0)}>Reset</button>
      </div>
    </div>
  );
};
