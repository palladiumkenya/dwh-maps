import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button.tsx";
import { Download } from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {getAgeGroups, getAgencies, getIndicators, getRegions, getSex} from "@/api/filters.ts";
import type {Indicator} from "@/types/indicator.ts";
import type {Region} from "@/types/region.ts";
import type {Agency} from "@/types/agency.ts";
import type {Sex} from "@/types/sex.ts";
import type {AgeGroup} from "@/types/age-group.ts";
import {Switch} from "@/components/ui/switch.tsx";
import type {MapFilters} from "@/types/MapFilters.ts";
import * as React from "react";

interface Props {
    filters: MapFilters;
    setFilters: React.Dispatch<React.SetStateAction<MapFilters>>;
}

const FilterPanel = ({ filters, setFilters }: Props) => {
    const update = (key: keyof MapFilters, value: string | boolean) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const { data: indicators, isLoading } = useQuery<Indicator[]>({
        queryKey: ["indicators"],
        queryFn: getIndicators,
    });

    const { data: regionsData, isLoading: isLoadingRegions } = useQuery<Region[]>({
        queryKey: ["region"],
        queryFn: getRegions,
    });

    const { data: agenciesData, isLoading: isLoadingAgencies } = useQuery<Agency[]>({
        queryKey: ["getAgencies"],
        queryFn: getAgencies,
    });

    const { data: sexData, isLoading: isLoadingSex } = useQuery<Sex[]>({
        queryKey: ["getSex"],
        queryFn: getSex,
    });

    const { data: ageGroupsData, isLoading: isLoadingAgeGroups } = useQuery<AgeGroup[]>({
        queryKey: ["getAgeGroups"],
        queryFn: getAgeGroups,
    });

    const uniqueCounties = React.useMemo(() => {
        const seen = new Set<string>();
        return regionsData?.filter((r) => {
            if (seen.has(r.county)) return false;
            seen.add(r.county);
            return true;
        }) ?? [];
    }, [regionsData]);

    const subCountiesForSelectedCounty = React.useMemo(() => {
        return regionsData?.filter((r) => r.county.toLowerCase() === filters.county.toLowerCase()) ?? [];
    }, [regionsData, filters.county]);

    const filtersList = [
        // "Sub County",
        "Facility",
        // "Sex",
        // "Age Category",
        // "Agency",
        "Partner",
    ];


    return (
        <div className="p-4 w-80 bg-white border-r space-y-4">
            {/* Assignment Period */}
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Assignment Period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7_days">Past 7 Days</SelectItem>
                    <SelectItem value="30_days">Past 30 Days</SelectItem>
                </SelectContent>
            </Select>

            {/* Indicator */}
            <Select value={filters.indicator} onValueChange={(v) => update("indicator", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Indicator" />
                </SelectTrigger>
                <SelectContent>
                    {isLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                        indicators?.map((indicator: Indicator) => (
                            <SelectItem key={indicator.name} value={indicator.name}>
                                {indicator.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <Select value={filters.county} onValueChange={(v) => update("county", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingRegions ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                        uniqueCounties.map((region, index) => (
                            <SelectItem key={`${region.county}-${index}`} value={region.county}>
                                {region.county}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <Select value={filters.subCounty} onValueChange={(v) => update("subCounty", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sub County" />
                </SelectTrigger>
                <SelectContent>
                    {subCountiesForSelectedCounty.map((region, index) => (
                        <SelectItem key={`${region.subCounty}-${index}`} value={region.subCounty}>
                            {region.subCounty}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filters.sex} onValueChange={(v) => update("sex", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sex" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingSex ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                        sexData?.map((s) => (
                            <SelectItem key={s.sex} value={s.sex}>
                                {s.sex}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <Select value={filters.ageGroup} onValueChange={(v) => update("ageGroup", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Age Category" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingAgeGroups ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                        ageGroupsData?.map((ageGroup: AgeGroup) => (
                            <SelectItem key={ageGroup.ageGroup} value={ageGroup.ageGroup}>
                                {ageGroup.ageGroup}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <Select value={filters.agency} onValueChange={(v) => update("agency", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Agency" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingAgencies ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                        agenciesData?.map((agency: Agency) => (
                            <SelectItem key={agency.agency} value={agency.agency}>
                                {agency.agency}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            {/* Other filters */}
            {filtersList.map((label) => (
                <Select key={label}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sample">Sample Option</SelectItem>
                    </SelectContent>
                </Select>
            ))}

            {/* Filter and Reset buttons */}
            <Button className="w-full">Filter</Button>
            <Button variant="outline" className="w-full">Reset Filter</Button>

            <div className="pt-4 space-y-3">
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 w-32">Choropleth</span>
                    <Switch
                        checked={filters.choroplethEnabled}
                        onCheckedChange={(v) => update("choroplethEnabled", v)}
                        className="bg-gray-200 data-[state=checked]:bg-blue-500"
                    />
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 w-32">Bubble Map</span>
                    <Switch
                        checked={filters.bubbleMapEnabled}
                        onCheckedChange={(v) => update("bubbleMapEnabled", v)}
                        className="bg-gray-200 data-[state=checked]:bg-blue-500"
                    />
                </div>
            </div>

            {/* Download */}
            <Button className="w-full mt-2" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Result
            </Button>
        </div>
    );
};
export default FilterPanel;
