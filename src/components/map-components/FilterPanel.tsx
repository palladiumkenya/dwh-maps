import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
    const update = (key: keyof MapFilters, value: string | boolean | string []) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const { data: indicators, isLoading } = useQuery<Indicator[]>({
        queryKey: ["indicators"],
        queryFn: getIndicators,
    });

    const { data: regionsData } = useQuery<Region[]>({
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
        if (!regionsData || !filters.counties || filters.counties.length === 0) return [];
        return regionsData?.filter((r) =>
            (filters.counties ?? []).includes(r.county)
        );
    }, [regionsData, filters.counties]);

    const uniqueAgencies = React.useMemo(() => {
        const seen = new Set<string>();
        return agenciesData?.filter((r) => {
            if (seen.has(r.agency)) return false;
            seen.add(r.agency);
            return true;
        }) ?? [];
    }, [agenciesData]);

    const partnersForSelectedAgency = React.useMemo(() => {
        return agenciesData?.filter((r) => r.agency.toLowerCase() === filters?.agency?.toLowerCase()) ?? [];
    }, [agenciesData, filters.agency]);

    const partnersForSelectedSubCounty = React.useMemo(() => {
        return regionsData?.filter((r) => r.subCounty.toLowerCase() === filters?.subCounty?.toLowerCase()) ?? [];
    }, [regionsData, filters.subCounty]);


    return (
        <div className="p-4 w-80 bg-white border-r space-y-4">

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

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.counties && filters.counties.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.counties && filters.counties.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.counties ?? []).length > 0
                            ? (filters.counties ?? []).join(", ")
                            : "Select County"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {uniqueCounties.map((region, index) => {
                                const countyName = region.county;
                                const selectedCounties = filters.counties ?? [];
                                const isSelected = selectedCounties.includes(countyName);

                                return (
                                    <CommandItem
                                        key={`${countyName}-${index}`}
                                        onSelect={() => {
                                            const newValue = isSelected
                                                ? selectedCounties.filter((c) => c !== countyName)
                                                : [...selectedCounties, countyName];
                                            update("counties", newValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {countyName}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

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

            <Select value={filters.facilityName} onValueChange={(v) => update("facilityName", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Facility Name" />
                </SelectTrigger>
                <SelectContent>
                    {partnersForSelectedSubCounty.map((subCounty, index) => (
                        <SelectItem key={`${subCounty.facilityName}-${index}`} value={subCounty.facilityName}>
                            {subCounty.facilityName}
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
                        uniqueAgencies?.map((agency: Agency) => (
                            <SelectItem key={agency.agency} value={agency.agency}>
                                {agency.agency}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <Select value={filters.partner} onValueChange={(v) => update("partner", v)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Partner" />
                </SelectTrigger>
                <SelectContent>
                    {partnersForSelectedAgency.map((agency, index) => (
                        <SelectItem key={`${agency.partnerName}-${index}`} value={agency.partnerName}>
                            {agency.partnerName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

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
