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

export async function getIndicatorsMonthly() {
    const res = await fetch(`${API_BASE_URL}/api/GfFilter/Indicator`);
    if (!res.ok) throw new Error("Failed to fetch GF indicators");
    return res.json();
}

export async function getRegionsMonthly() {
    const res = await fetch(`${API_BASE_URL}/api/GfFilter/Region`);
    if (!res.ok) throw new Error("Failed to fetch GF regions");
    return res.json();
}

export async function getAgenciesMonthly() {
    const res = await fetch(`${API_BASE_URL}/api/GfFilter/Agency`);
    if (!res.ok) throw new Error("Failed to fetch GF agencies");
    return res.json();
}

export async function getSexMonthly() {
    const res = await fetch(`${API_BASE_URL}/api/GfFilter/Sex`);
    if (!res.ok) throw new Error("Failed to fetch GF sex");
    return res.json();
}

export async function getAgeGroupsMonthly() {
    const res = await fetch(`${API_BASE_URL}/api/GfFilter/Age`);
    if (!res.ok) throw new Error("Failed to fetch GF age groups");
    return res.json();
}
