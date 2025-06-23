import FilterPanel from "@/components/map-components/FilterPanel.tsx";
import {Header} from "@/components/header/Header.tsx";
import {MapView} from "@/components/map-components/MapView.tsx";
import {useEffect, useRef, useState} from "react";
import type {MapFilters} from "@/types/MapFilters.ts";
import L from "leaflet";
import {NavigationHeader} from "@/components/header/NavigationHeader.tsx";
import { defaultMapFilters } from "@/constants/defaultFilters.ts";

function App() {
    const mapRef = useRef<L.Map | null>(null);

    const [activeTab, setActiveTab] = useState<"realtime" | "monthly">("realtime");

    // Filters for each tab
    const [realtimeFilters, setRealtimeFilters] = useState<MapFilters>({
        ...defaultMapFilters,
        indicator: "DELAYED VL TESTING",
    });

    const [monthlyFilters, setMonthlyFilters] = useState<MapFilters>({
        ...defaultMapFilters,
        indicator: "AHD",
    });

    const filters = activeTab === "realtime" ? realtimeFilters : monthlyFilters;
    const setFilters = activeTab === "realtime" ? setRealtimeFilters : setMonthlyFilters;

    const resetMapView = () => {
        mapRef.current?.setView([0.0236, 37.9062], 7);
    };

    useEffect(() => {
        resetMapView();
    }, [activeTab]);

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-100">
            <Header />
            <NavigationHeader />

            <div className="flex flex-1 overflow-hidden">
                <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    resetMapView={resetMapView}
                    activeTab={activeTab}
                />

                <div className="flex-1 h-full">
                    <MapView
                        filters={filters}
                        mapRef={mapRef}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
