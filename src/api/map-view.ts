interface MapQueryParams {
    indicator?: string;
    counties?: string[];
    subCounty?: string[];
    sex?: string[];
    ageGroup?: string;
    agency?: string;
    partner?: string;
}

export async function getMapData(params: MapQueryParams) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (!value || key === "choroplethEnabled") return;

        if (key === "counties" && Array.isArray(value)) {
            value.forEach((county) => {
                query.append("County", county); // capital 'C' as per your example
            });
        } else if(key === "subCounty" && Array.isArray(value)) {
            value.forEach((subCounty) => {
                query.append("SubCounty", subCounty);
            });
        } else if(key === "sex" && Array.isArray(value)) {
            value.forEach((sex) => {
                query.append("Sex", sex);
            });
        }
        else {
            query.append(key, value as string);
        }
    });

    const res = await fetch(
        `https://live.kenyahmis.org/api/CsRealtimePoint/All?${query.toString()}`
    );

    if (!res.ok) throw new Error("Failed to fetch map data");

    return res.json();
}
