interface MapQueryParams {
    indicator?: string;
    counties?: string[];
    subCounty?: string[];
    sex?: string[];
    ageGroup?: string[];
    agency?: string[];
    partner?: string[];
    facilityName?: string[];
}

export async function getMapData(params: MapQueryParams) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (!value || key === "choroplethEnabled" || key === "bubbleMapEnabled") return;

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
        } else if(key === "facilityName" && Array.isArray(value)) {
            value.forEach((facilityName) => {
                query.append("FacilityName", facilityName);
            });
        } else if(key === "ageGroup" && Array.isArray(value)) {
            value.forEach((ageGroup) => {
                query.append("AgeGroup", ageGroup);
            });
        } else if(key === "agency" && Array.isArray(value)) {
            value.forEach((agency) => {
                query.append("Agency", agency);
            });
        } else if(key === "partner" && Array.isArray(value)) {
            value.forEach((partner) => {
                query.append("PartnerName", partner);
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
