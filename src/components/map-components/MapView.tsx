import {
    MapContainer,
    TileLayer,
    GeoJSON,
    CircleMarker,
    Popup,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
} from "geojson";

import kenyaCountiesRaw from "@/data/kenya-counties-simplified.json";
import kenyaSubCountiesRaw from "@/data/kenya-subcounties-simplied.json";
import kenyaWardsRaw from "@/data/kenya_wards.json";

import { useQuery } from "@tanstack/react-query";
import { getMapData } from "@/api/map-view.ts";
import type { MapFilters } from "@/types/MapFilters.ts";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import ZoomToCounty from "@/components/map-components/ZoomToCounty.tsx";
import MapLegend from "@/components/map-components/MapLegend.tsx";
import MapInfoControl from "@/components/map-components/MapInfoControl.tsx";
import type {CountyPoint, SubCountyPoint, WardPoint} from "@/types/MapData";

type FacilityPoint = {
    facilityName: string;
    lat: number;
    long: number;
    count: number;
    rate: number;
};

interface MapViewProps {
    filters: MapFilters;
    mapRef: React.RefObject<L.Map | null>;
}

export function MapView({ filters, mapRef }: MapViewProps) {
    const kenyaWards = kenyaWardsRaw as FeatureCollection<Geometry, GeoJsonProperties>;
    const kenyaSubCounties = kenyaSubCountiesRaw as FeatureCollection<Geometry, GeoJsonProperties>;
    const kenyaCounties = kenyaCountiesRaw as FeatureCollection<Geometry, GeoJsonProperties>;

    const geoJsonRef = useRef<L.GeoJSON>(null);
    const [hoveredRegion, setHoveredRegion] = useState<{ name: string; rate: number } | undefined>();

    const [selectedCounty, setSelectedCounty] = useState<string[]>(filters.counties ?? []);
    const [selectedSubCounty, setSelectedSubCounty] = useState<string[]>(filters.subCounty ?? []);

    useEffect(() => {
        setSelectedCounty(filters.counties ?? []);
    }, [filters.counties]);

    useEffect(() => {
        setSelectedSubCounty(filters.subCounty ?? []);
    }, [filters.subCounty]);

    const { data, isLoading } = useQuery({
        queryKey: ["map-data", filters],
        queryFn: () => getMapData(filters),
        enabled: !!filters,
    });

    const normalize = (value: string) =>
        value.toLowerCase().replace(/\s*ward$/, '').trim();

    const getRate = (name?: string): number | undefined => {
        if (!name) return undefined;

        if (selectedSubCounty.length > 0) {
            const normalizedName = normalize(name);
            return data?.wardPoints?.find((w: WardPoint) => normalize(w.ward) === normalizedName)?.rate;
        } else if (selectedCounty.length > 0) {
            return data?.subCountyPoints?.find((s: SubCountyPoint) => s.subCounty.toLowerCase() === name.toLowerCase())?.rate;
        } else {
            return data?.countyPoints?.find((c: CountyPoint) => c.county.toLowerCase() === name.toLowerCase())?.rate;
        }
    };

    const getColorByRate = (rate: number = 0) => {
        if (rate >= 5) return "#dc2626";
        if (rate >= 3) return "#facc15";
        return "#16a34a";
    };

    const commonStyle = (feature?: Feature<Geometry, GeoJsonProperties>) => {
        const name =
            selectedSubCounty.length > 0
                ? feature?.properties?.ward
                : selectedCounty.length > 0
                    ? feature?.properties?.ADM2_EN
                    : feature?.properties?.shapeName;

        const rate = getRate(name);
        return {
            fillColor: getColorByRate(rate),
            weight: 1,
            opacity: 1,
            color: "#1f2937",
            dashArray: "3",
            interactive: true,
            fillOpacity: rate === undefined ? 0 : 0.7,
            className: "geo-boundary",
        };
    };

    const getBoundsFromFeatures = (features: Feature[]): L.LatLngBounds | null => {
        const geoJsonLayer = L.geoJSON(features);
        return geoJsonLayer.getBounds();
    };

    const highlightFeature = (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        const props = layer.feature?.properties;

        // Determine the most accurate region name
        const name =
            props?.ward ||
            props?.WARD ||
            props?.ADM2_EN ||
            props?.SUB_COUNTY ||
            props?.shapeName ||
            props?.COUNTY;

        const rate = getRate(name);
        setHoveredRegion({ name, rate: rate ?? 0 });

        layer.setStyle({
            weight: 4,
            color: "#000",
            dashArray: "",
            fillOpacity: 0.7,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    };

    const resetHighlight = (e: L.LeafletMouseEvent) => {
        geoJsonRef.current?.resetStyle(e.target);
        setHoveredRegion(undefined);
    };

    const onEachCounty = (_feature: Feature, layer: L.Layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };

    const onEachSubCounty = (_feature: Feature, layer: L.Layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };

    const onEachWard = (_feature: Feature, layer: L.Layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };

    const SetMapRef = ({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) => {
        const map = useMap();
        useEffect(() => {
            mapRef.current = map;
        }, [map, mapRef]);
        return null;
    };

    useEffect(() => {
        const map = mapRef.current;
        if (!map || isLoading) return;

        if (selectedSubCounty.length > 0) {
            const matchingWards = kenyaWards.features.filter((f) =>
                selectedSubCounty.map((b) => `${b.toLowerCase()} sub county`).includes(f.properties?.subcounty?.toLowerCase())
            );
            const bounds = getBoundsFromFeatures(matchingWards);
            if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
        } else if (selectedCounty.length > 0) {
            const matchingSubcounties = kenyaSubCounties.features.filter((f) =>
                selectedCounty.map((c) => c.toLowerCase()).includes(f.properties?.ADM1_EN?.toLowerCase())
            );
            const bounds = getBoundsFromFeatures(matchingSubcounties);
            if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [selectedCounty, selectedSubCounty, isLoading]);

    const renderGeoLayer = () => {
        if (selectedSubCounty.length > 0) {
            const filteredWards = kenyaWards.features.filter((f) =>
                selectedSubCounty.map((b) => `${b.toLowerCase()} sub county`).includes(f.properties?.subcounty?.toLowerCase())
            );

            return (
                <GeoJSON
                    key={`wards-${selectedSubCounty.join(",")}`}
                    data={{ ...kenyaWards, features: filteredWards } as FeatureCollection<Geometry, GeoJsonProperties>}
                    style={commonStyle}
                    onEachFeature={onEachWard}
                />
            );
        }

        if (selectedCounty.length > 0) {
            const filteredSubCounties = kenyaSubCounties.features.filter((f) =>
                selectedCounty.map((c) => c.toLowerCase()).includes(f.properties?.ADM1_EN?.toLowerCase())
            );

            return (
                <GeoJSON
                    key={`subcounties-${selectedCounty.join(",")}`}
                    data={{ ...kenyaSubCounties, features: filteredSubCounties } as FeatureCollection<Geometry, GeoJsonProperties>}
                    style={commonStyle}
                    onEachFeature={onEachSubCounty}
                />
            );
        }

        return (
            <GeoJSON
                key="counties-default"
                data={kenyaCounties as FeatureCollection}
                style={commonStyle}
                onEachFeature={onEachCounty}
                ref={geoJsonRef}
            />
        );
    };

    return (
        <div className="h-full w-full relative">
            <MapContainer
                ref={mapRef}
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
                        {renderGeoLayer()}
                        <SetMapRef mapRef={mapRef} />
                        <ZoomToCounty countyNames={filters.counties} />
                        <MapLegend />
                        <MapInfoControl hoveredCounty={hoveredRegion} />
                    </>
                )}

                {filters.bubbleMapEnabled &&
                    !isLoading &&
                    data?.facilityPoints.map((point: FacilityPoint, idx: number) => (
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
