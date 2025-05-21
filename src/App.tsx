import FilterPanel from "@/components/map-components/FilterPanel.tsx";
import {Header} from "@/components/header/Header.tsx";
import {MapView} from "@/components/map-components/MapView.tsx";
import {useRef, useState} from "react";
import type {MapFilters} from "@/types/MapFilters.ts";
import L from "leaflet";
import {NavigationHeader} from "@/components/header/NavigationHeader.tsx";

function App() {
    const mapRef = useRef<L.Map | null>(null);
    const [filters, setFilters] = useState<MapFilters>({
        indicator: "DELAYED VL TESTING",
        counties: [],
        subCounty: [],
        sex: [],
        ageGroup: [],
        agency: [],
        partner: [],
        facilityName: [],
        choroplethEnabled: true,
        bubbleMapEnabled: false,
    });

    const resetMapView = () => {
        mapRef.current?.setView([0.0236, 37.9062], 7);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-100">
            <Header />
            <NavigationHeader />

            <div className="flex flex-1 overflow-hidden">
                <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    resetMapView={resetMapView}
                />

                <div className="flex-1 h-full">
                    <MapView filters={filters} mapRef={mapRef} />
                </div>
            </div>
        </div>
    );
}

export default App;
