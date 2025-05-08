import { useEffect } from "react";
import { useMap } from "react-leaflet";
import kenyaCounties from "@/data/kenya-counties-simplified.json";
import L from "leaflet";

interface ZoomToCountyProps {
    countyNames: string[] | undefined;
}

export default function ZoomToCounty({ countyNames }: ZoomToCountyProps) {
    const map = useMap();

    useEffect(() => {
        if (!countyNames || countyNames.length === 0) return;

        const allLatLngs: [number, number][] = [];

        countyNames.forEach((countyName) => {
            const feature = (kenyaCounties as any).features.find(
                (f: any) =>
                    f.properties.shapeName.toLowerCase() === countyName.toLowerCase()
            );

            if (feature) {
                let coords: [number, number][] = [];

                if (feature.geometry.type === "Polygon") {
                    coords = feature.geometry.coordinates[0].map(
                        ([lng, lat]: [number, number]) => [lat, lng]
                    );
                } else if (feature.geometry.type === "MultiPolygon") {
                    coords = feature.geometry.coordinates[0][0].map(
                        ([lng, lat]: [number, number]) => [lat, lng]
                    );
                }

                allLatLngs.push(...coords);
            }
        });

        if (allLatLngs.length > 0) {
            const bounds = L.latLngBounds(allLatLngs);
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [countyNames, map]);

    return null;
}
