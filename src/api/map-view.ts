interface MapQueryParams {
    indicator?: string;
    counties?: string[];  // 👈 updated
    subCounty?: string;
    sex?: string;
    ageGroup?: string;
    agency?: string;
    partner?: string;
}

export async function getMapData(params: MapQueryParams) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (!value) return;

        if (key === "counties" && Array.isArray(value) && value.length > 0) {
            value.forEach((county) => {
                query.append("County", county); // capital 'C' as per your example
            });
        } else {
            query.append(key, value as string);
        }
    });

    const res = await fetch(
        `https://live.kenyahmis.org/api/CsRealtimePoint/All?${query.toString()}`
    );

    if (!res.ok) throw new Error("Failed to fetch map data");

    return res.json();
}
