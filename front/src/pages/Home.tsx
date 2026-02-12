import React, { useState, useEffect, useCallback } from 'react';
import client from '../api/client.js';
import Stopwatch from '../components/Stopwatch.js';
import TaskItem from '../components/TaskItem.js';
import { useTaskSocket } from '../hooks/useTaskSocket.js';

interface User {
  userId: string;
  userName: string;
  task: string;
  status: number;
}

function Home() {
  // const [users, setUsers] = useState<User[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const { users, isConnected } = useTaskSocket();

  // ログインユーザー情報の取得
  const getLoggedInUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // タスクを送信する（Stopwatchから呼ばれる）
  const handlePostTask = useCallback(async () => {
    if (!taskInput) return;
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      alert("ログインが必要です");
      return;
    }

    try {
      await client.post(`/task`, {
        userId: currentUser.userId, 
        userName: currentUser.userName, 
        task: taskInput
      });
    } catch (err) {
      console.error("送信失敗", err);
    }
  }, [taskInput]);

  const handleDeleteTask = useCallback(async () => {
    const currentUser = getLoggedInUser();
    if(!currentUser) return;
    try {
      await client.delete(`/task/${currentUser.userId}`);
    } catch {
      console.error("タスク削除失敗", Error);
    }
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center tracking-tight">共有ボード</h1>
        
        {/* Stopwatchコンポーネントに送信関数を渡す */}
        <Stopwatch onStart={handlePostTask} onStop={handleDeleteTask} />
        
        {/* 入力フォーム */}
        <div className="mb-10">
          <input 
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
            value={taskInput} 
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="今のタスクを入力（例：Javaの勉強中）"
          />
        </div>
  
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700 px-2 flex items-center gap-2">
            みんなの稼働状況
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">{users.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={isConnected ? "text-green-500" : "text-gray-400"}>
         {isConnected ? "● 同時接続中" : "○ 接続を確認中..."}
       </div>
            {users.map(user => (
              <TaskItem key={user.userId} userName={user.userName} task={user.task} isActive={user.status === 1}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;