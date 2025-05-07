import { useEffect } from "react";
import { useMap } from "react-leaflet";
import kenyaCounties from "@/data/kenya-counties-simplified.json";

interface ZoomToCountyProps {
    countyName: string;
}

export default function ZoomToCounty({ countyName }: ZoomToCountyProps) {
    const map = useMap();

    useEffect(() => {
        if (!countyName) return;

        const countyFeature = (kenyaCounties as any).features.find(
            (f: any) => f.properties.shapeName.toLowerCase() === countyName.toLowerCase()
        );

        if (countyFeature) {
            const latlngs = [];

            if (countyFeature.geometry.type === "Polygon") {
                latlngs.push(...countyFeature.geometry.coordinates[0]);
            } else if (countyFeature.geometry.type === "MultiPolygon") {
                latlngs.push(...countyFeature.geometry.coordinates[0][0]);
            }

            const bounds = latlngs.map(([lng, lat]) => [lat, lng]);
            map.fitBounds(bounds);
        }
    }, [countyName, map]);

    return null;
}
