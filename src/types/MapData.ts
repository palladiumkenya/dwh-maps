export interface WardPoint {
    ward: string;
    subcounty: string;
    rate: number;
    // any others
}

export interface SubCountyPoint {
    subCounty: string;
    rate: number;
}

export interface CountyPoint {
    county: string;
    rate: number;
}

export interface FacilityPoint {
    facilityName: string;
    lat: number;
    long: number;
    count: number;
    rate: number;
}

export interface MapData {
    wardPoints: WardPoint[];
    subCountyPoints: SubCountyPoint[];
    countyPoints: CountyPoint[];
    facilityPoints: FacilityPoint[];
}
