interface MapQueryParams {
    indicator?: string;
    counties?: string[];
    subCounty?: string[];
    sex?: string[];
    ageGroup?: string[];
    agency?: string[];
    partner?: string[];
    facilityName?: string[];
    startPeriod?: string;
    endPeriod?: string;
}

import {getRuntimeConfig} from "@/lib/config.ts";

const { API_BASE_URL } = getRuntimeConfig();

export async function getMapData(params: MapQueryParams, tab: "realtime" | "monthly" = "realtime") {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (!value || key === "choroplethEnabled" || key === "bubbleMapEnabled") return;

        if (tab !== "realtime" && (key === "startPeriod" || key === "endPeriod")) return;

        if (Array.isArray(value)) {
            const paramMap: Record<string, string> = {
                counties: "County",
                subCounty: "SubCounty",
                sex: "Sex",
                facilityName: "FacilityName",
                ageGroup: "AgeGroup",
                agency: "Agency",
                partner: "PartnerName",
            };

            const mappedKey = paramMap[key] || key;
            value.forEach((v) => query.append(mappedKey, v));
        } else {
            query.append(key, value as string);
        }
    });

    const endpoint =
        tab === "monthly"
            ? `${API_BASE_URL}/api/GfAggregatePoint/All`
            : `${API_BASE_URL}/api/CsRealtimePoint/All`;

    const res = await fetch(`${endpoint}?${query.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch map data");

    return res.json();
}
