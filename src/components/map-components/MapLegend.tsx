import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function MapLegend() {
    const map = useMap();

    useEffect(() => {
        const LegendControl = L.Control.extend({
            options: { position: "bottomright" },

            onAdd: function () {
                const div = L.DomUtil.create("div", "info legend");
                const grades = [0, 15, 30];
                const labels: string[] = [];

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
            },
        });

        const legend = new LegendControl();
        map.addControl(legend);

        return () => {
            map.removeControl(legend);
        };
    }, [map]);

    return null;
}
