import React, { useState, useEffect, useRef } from 'react';

interface StopwatchProps {
  onStart: () => void;
  onStop: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onStart, onStop }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // ブラウザ環境のsetIntervalはnumberを返すため、型を明示
  const timerRef = useRef<number | null>(null);

  // 初回マウント時に保存された時間を復元
  useEffect(() => {
    const savedTime = localStorage.getItem('stopwatch_time');
    if (savedTime) setTime(parseInt(savedTime, 10));
  }, []);

  // タイマー動作ロジック
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem('stopwatch_time', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem('stopwatch_time');
  };

  return (
    <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl mb-8 text-center border border-slate-700">
      <div className="text-6xl font-mono font-bold mb-6 tracking-widest text-blue-400">
        {formatTime(time)}
      </div>
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button 
            onClick={() => { setIsRunning(true); onStart(); }} 
            className="bg-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
          >
            開始 / 再開
          </button>
        ) : (
          <button 
            onClick={() => {setIsRunning(false); onStop();}} 
            className="bg-yellow-500 px-8 py-3 rounded-full font-bold hover:bg-yellow-600 active:scale-95 transition-all text-slate-900"
          >
            一時停止
          </button>
        )}
        <button 
          onClick={handleReset} 
          className="bg-red-500/10 text-red-400 border border-red-500/50 px-8 py-3 rounded-full font-bold hover:bg-red-500 hover:text-white active:scale-95 transition-all"
        >
          リセット
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;