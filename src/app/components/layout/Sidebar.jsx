// src/components/layout/Sidebar.jsx

import { Users, Trophy, LayoutDashboard, ChartCandlestick, Gift, LogOut, Circle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center p-6">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-amber-100 rounded-full flex items-center justify-center">
          <Circle className="w-5 h-5" fill="black" stroke="none" />
        </div>
        <span className="ml-3 text-xl font-semibold">Cirrica</span>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-6 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <LayoutDashboard className="mr-3 w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <Users className="mr-3 w-5 h-5" />
            Teams
          </a>
          <a href="#" className="flex items-center px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-100 text-black rounded-lg">
            <Trophy className="mr-3 w-5 h-5" />
            Tournaments
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <ChartCandlestick className="mr-3 w-5 h-5" />
            Select Stock
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <Gift className="mr-3 w-5 h-5" />
            Promotions
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <Users className="mr-3 w-5 h-5" />
            Friends
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <span className="mr-3">⚙️</span>
            Setting
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-red-400 hover:bg-black rounded-lg">
            <LogOut className="mr-3 w-5 h-5" />
            Logout
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;