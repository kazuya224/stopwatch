import React from 'react';

interface TaskItemProps {
  userName: string;
  task: string;
  isActive: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ userName, task }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* 稼働中を示すインジケーター */}
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
          {userName}
        </span>
        <span className="text-lg text-gray-800 font-semibold leading-tight">
          {task}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;