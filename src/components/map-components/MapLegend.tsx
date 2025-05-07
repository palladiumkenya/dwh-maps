import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function MapLegend() {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            const grades = [0, 15, 30];
            const labels = [];

            for (let i = 0; i < grades.length; i++) {
                const from = grades[i];
                const to = grades[i + 1];

                const color =
                    from >= 30 ? "#dc2626" : from >= 15 ? "#facc15" : "#16a34a";

                labels.push(
                    `<i style="background:${color}; width: 16px; height: 16px; display:inline-block; margin-right:8px;"></i> ${from}${to ? "–" + to : "+"}`
                );
            }

            div.innerHTML = `<h4>Rate (%)</h4>${labels.join("<br>")}`;
            return div;
        };

        legend.addTo(map);

        // Cleanup when component unmounts
        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
}
