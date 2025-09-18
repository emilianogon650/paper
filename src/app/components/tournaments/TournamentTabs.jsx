// src/components/tournaments/TournamentTabs.jsx

const TournamentTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === tab.name
                ? 'bg-zinc-900 text-white border border-zinc-700'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>
    );
  };
  
  export default TournamentTabs;