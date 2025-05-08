import FilterPanel from "@/components/map-components/FilterPanel.tsx";
import {Header} from "@/components/header/Header.tsx";
import {MapView} from "@/components/map-components/MapView.tsx";
import {useState} from "react";
import type {MapFilters} from "@/types/MapFilters.ts";

function App() {
    const [filters, setFilters] = useState<MapFilters>({
        indicator: "DELAYED VL TESTING",
        counties: [],
        sex: "",
        ageGroup: "",
        agency: "",
        partner: "",
        choroplethEnabled: true,
        bubbleMapEnabled: false,
    });

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-100">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <FilterPanel filters={filters} setFilters={setFilters} />

                <div className="flex-1 h-full">
                    <MapView filters={filters} />
                </div>
            </div>
        </div>
    );
}

export default App;
