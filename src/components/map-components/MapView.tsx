import {MapContainer, TileLayer, GeoJSON, CircleMarker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import kenyaCounties from '@/data/kenya-counties-simplified.json';
import {useQuery} from "@tanstack/react-query";
import {getMapData} from "@/api/map-view.ts";
import type {MapFilters} from "@/types/MapFilters.ts";
import ZoomToCounty from "@/components/map-components/ZoomToCounty.tsx";
import MapLegend from "@/components/map-components/MapLegend.tsx";

type CountyPoint = { county: string; count: number; rate: number };
type FacilityPoint = {
    facilityName: string;
    lat: number;
    long: number;
    count: number;
    rate: number;
};

interface MapViewProps {
    filters: MapFilters;
}

export function MapView({ filters }: MapViewProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["map-data", filters],
        queryFn: () => getMapData(filters),
        enabled: !!filters,
    });

    const getRateByCounty = (countyName: string): number | undefined => {
        return data?.countyPoints.find((c: CountyPoint) => c.county.toLowerCase() === countyName.toLowerCase())?.rate;
    };

    const getColorByRate = (rate: number = 0) => {
        if (rate >= 5) return "#dc2626";       // Red: Critical gap
        if (rate >= 3) return "#facc15";       // Yellow: Moderate concern
        return "#16a34a";                      // Green: Acceptable level
    };

    const style = (feature: any) => {
        const rate = getRateByCounty(feature.properties.shapeName);
        if (rate === undefined) {
            return {
                fillOpacity: 0,
                weight: 0.5,
                color: "#ccc",
            };
        }

        return {
            fillColor: getColorByRate(rate),
            weight: 1,
            opacity: 1,
            color: "white",
            fillOpacity: 0.7,
        };
    };

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[0.0236, 37.9062]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filters.choroplethEnabled && !isLoading && (
                    <>
                        <GeoJSON data={kenyaCounties as any} style={style}/>
                        <ZoomToCounty countyNames={filters.counties}/>
                        <MapLegend />
                    </>
                )}

                {filters.bubbleMapEnabled && !isLoading && data?.facilityPoints.map((point: FacilityPoint, idx: number) => (
                    <CircleMarker
                        key={idx}
                        center={[point.lat, point.long]}
                        radius={Math.max(4, point.count * 2)}
                        pathOptions={{
                            color: "#2563eb",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.5,
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>{point.facilityName}</strong>
                                <br />
                                Count: {point.count}
                                <br />
                                Rate: {point.rate.toFixed(2)}%
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}
