import { Control, DomUtil } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface MapInfoControlProps {
    hoveredCounty?: {
        name: string;
        rate: number;
    };
}

export default function MapInfoControl({ hoveredCounty }: MapInfoControlProps) {
    const map = useMap();

    useEffect(() => {
        const infoControl = new Control({ position: "topright" });

        infoControl.onAdd = function () {
            const div = DomUtil.create("div", "info leaflet-control");
            div.style.background = "white";
            div.style.padding = "6px 8px";
            div.style.borderRadius = "5px";
            div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
            div.innerHTML = "<h4>County Info</h4>";
            return div;
        };

        infoControl.addTo(map);

        const update = (props?: { name: string; rate: number }) => {
            const div = infoControl.getContainer();
            if (div) {
                div.innerHTML =
                    "<h4>County Info</h4>" +
                    (props
                        ? `<b>${props.name}</b><br />Rate: ${props.rate.toFixed(2)}%`
                        : "Hover over a county");
            }
        };

        update(hoveredCounty);

        return () => {
            infoControl.remove();
        };
    }, [map, hoveredCounty]);

    return null;
}
