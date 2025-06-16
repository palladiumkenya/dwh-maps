type Tab = "realtime" | "monthly";

interface MapTabsProps {
    activeTab: Tab;
    onChange: (tab: Tab) => void;
}

export const MapTabs = ({ activeTab, onChange }: MapTabsProps) => {
    return (
        <div className="w-full bg-white shadow-sm border-b border-gray-200 flex">
            <button
                className={`px-6 py-3 font-medium border-r border-gray-300 ${
                    activeTab === "realtime" ? "text-purple-700 border-b-2 border-purple-700" : "text-gray-600"
                }`}
                onClick={() => onChange("realtime")}
            >
                Realtime Hotspot Maps
            </button>
            <button
                className={`px-6 py-3 font-medium ${
                    activeTab === "monthly" ? "text-purple-700 border-b-2 border-purple-700" : "text-gray-600"
                }`}
                onClick={() => onChange("monthly")}
            >
                Monthly Hotspot Maps
            </button>
        </div>
    );
};
