import { useEffect } from "react";
import { useMap } from "react-leaflet";
import kenyaCounties from "@/data/kenya-counties-simplified.json";

interface ZoomToCountyProps {
    countyName: string | undefined;
}

export default function ZoomToCounty({ countyName }: ZoomToCountyProps) {
    const map = useMap();

    useEffect(() => {
        if (!countyName) return;

        const countyFeature = (kenyaCounties as any).features.find(
            (f: any) => f.properties.shapeName.toLowerCase() === countyName.toLowerCase()
        );

        if (!countyFeature) return;

        let coordinates: [number, number][] = [];

        if (countyFeature.geometry.type === "Polygon") {
            coordinates = countyFeature.geometry.coordinates[0].map(
                ([lng, lat]: [number, number]) => [lat, lng]
            );
        } else if (countyFeature.geometry.type === "MultiPolygon") {
            coordinates = countyFeature.geometry.coordinates[0][0].map(
                ([lng, lat]: [number, number]) => [lat, lng]
            );
        }

        if (coordinates.length > 0) {
            map.fitBounds(coordinates); // ✅ Valid LatLngBoundsExpression
        }
    }, [countyName, map]);

    return null;
}
