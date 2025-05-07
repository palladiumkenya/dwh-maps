interface MapQueryParams {
    indicator?: string;
    county?: string;
    subCounty?: string;
    sex?: string;
    ageGroup?: string;
    agency?: string;
    partner?: string;
}

export async function getMapData(params: MapQueryParams) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
    });

    const res = await fetch(`https://live.kenyahmis.org/api/CsRealtimePoint/All?${query.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch map data");

    return res.json();
}
