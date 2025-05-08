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

                div.innerHTML = `
          <h4>Legend</h4>
          <table style="font-size: 12px; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 4px;">Color</th>
                <th style="padding: 4px;">Threshold Range</th>
                <th style="padding: 4px;">Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 4px;">
                  <span style="display:inline-block; width:14px; height:14px; background:#dc2626; border-radius:50%;"></span>
                </td>
                <td style="padding: 4px;">≥ 5%</td>
                <td style="padding: 4px;">Critical gap — requires urgent intervention</td>
              </tr>
              <tr>
                <td style="padding: 4px;">
                  <span style="display:inline-block; width:14px; height:14px; background:#facc15; border-radius:50%;"></span>
                </td>
                <td style="padding: 4px;">≥ 3% and &lt; 5%</td>
                <td style="padding: 4px;">Moderate concern — needs attention</td>
              </tr>
              <tr>
                <td style="padding: 4px;">
                  <span style="display:inline-block; width:14px; height:14px; background:#16a34a; border-radius:50%;"></span>
                </td>
                <td style="padding: 4px;">≥ 0% and &lt; 3%</td>
                <td style="padding: 4px;">Acceptable level — ongoing monitoring</td>
              </tr>
            </tbody>
          </table>
        `;

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
