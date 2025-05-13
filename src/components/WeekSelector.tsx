import React from 'react';
import { useProgressStore } from '../store/progressStore';

const WeekSelector: React.FC = () => {
  const { currentWeek, setCurrentWeek } = useProgressStore();

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3, 4].map((week) => (
        <button
          key={week}
          onClick={() => setCurrentWeek(week)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            currentWeek === week
              ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Semana {week}
        </button>
      ))}
    </div>
  );
}

export default WeekSelector