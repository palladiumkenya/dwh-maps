import {getRuntimeConfig} from "@/lib/config.ts";

const { API_BASE_URL } = getRuntimeConfig();

export async function getIndicators() {
    const res = await fetch(`${API_BASE_URL}/api/CsFilter/Indicator`);
    if (!res.ok) throw new Error("Failed to fetch indicators");
    return res.json();
}

export async function getRegions() {
    const res = await fetch(`${API_BASE_URL}/api/CsFilter/Region`);
    if (!res.ok) throw new Error("Failed to fetch regions");
    return res.json();
}

export async function getAgencies() {
    const res = await fetch(`${API_BASE_URL}/api/CsFilter/Agency`);
    if (!res.ok) throw new Error("Failed to fetch agencies");
    return res.json();
}

export async function getSex() {
    const res = await fetch(`${API_BASE_URL}/api/CsFilter/Sex`);
    if (!res.ok) throw new Error("Failed to fetch sex");
    return res.json();
}

export async function getAgeGroups() {
    const res = await fetch(`${API_BASE_URL}/api/CsFilter/Age`);
    if (!res.ok) throw new Error("Failed to fetch age groups");
    return res.json();
}
