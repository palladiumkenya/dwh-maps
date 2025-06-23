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
import {CalendarIcon, Check} from "lucide-react";
import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button.tsx";
// import { Download } from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {
    getAgeGroups, getAgeGroupsMonthly,
    getAgencies, getAgenciesMonthly,
    getIndicators,
    getIndicatorsMonthly,
    getRegions,
    getRegionsMonthly,
    getSex, getSexMonthly
} from "@/api/filters.ts";
import type {Indicator} from "@/types/indicator.ts";
import type {Region} from "@/types/region.ts";
import type {Agency} from "@/types/agency.ts";
import type {Sex} from "@/types/sex.ts";
import type {AgeGroup} from "@/types/age-group.ts";
import {Switch} from "@/components/ui/switch.tsx";
import type {MapFilters} from "@/types/MapFilters.ts";
import * as React from "react";
import {defaultMapFilters} from "@/constants/defaultFilters.ts";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import type {DateRange} from "react-day-picker";

interface Props {
    filters: MapFilters;
    setFilters: React.Dispatch<React.SetStateAction<MapFilters>>;
    resetMapView: () => void;
    activeTab: "realtime" | "monthly";
}

const FilterPanel = ({ filters, setFilters, resetMapView, activeTab }: Props) => {
    const update = (key: keyof MapFilters, value: string | boolean | string []) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        filters.startPeriod
            ? {
                from: new Date(filters.startPeriod),
                to: filters.endPeriod ? new Date(filters.endPeriod) : undefined,
            }
            : undefined,
    );

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            startPeriod: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
            endPeriod: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        }))
    }, [dateRange]);

    const { data: indicators, isLoading } = useQuery<Indicator[]>({
        queryKey: ["indicators", activeTab],
        queryFn: () => activeTab === "monthly" ? getIndicatorsMonthly() : getIndicators(),
    });

    const { data: regionsData } = useQuery<Region[]>({
        queryKey: ["region", activeTab],
        queryFn: () => activeTab === "monthly" ? getRegionsMonthly() : getRegions(),
    });

    const { data: agenciesData, isLoading: isLoadingAgencies } = useQuery<Agency[]>({
        queryKey: ["getAgencies", activeTab],
        queryFn: () => activeTab === "monthly" ? getAgenciesMonthly() : getAgencies(),
    });

    const { data: sexData, isLoading: isLoadingSex } = useQuery<Sex[]>({
        queryKey: ["getSex", activeTab],
        queryFn: () => activeTab === "monthly" ? getSexMonthly() : getSex(),
    });

    const { data: ageGroupsData, isLoading: isLoadingAgeGroups } = useQuery<AgeGroup[]>({
        queryKey: ["getAgeGroups", activeTab],
        queryFn: () => activeTab === "monthly" ? getAgeGroupsMonthly() : getAgeGroups(),
    });

    const uniqueCounties = React.useMemo(() => {
        const seen = new Set<string>();
        return regionsData?.filter((r) => {
            if (seen.has(r.county)) return false;
            seen.add(r.county);
            return true;
        }) ?? [];
    }, [regionsData]);

    const subCounties = React.useMemo(() => {
        const seen = new Set<string>();
        return regionsData?.filter((r) => {
            if (seen.has(r.subCounty)) return false;
            seen.add(r.subCounty);
            return true;
        }) ?? [];
    }, [regionsData]);

    const facilities = React.useMemo(() => {
        const seen = new Set<string>();
        return regionsData?.filter((r) => {
            if (seen.has(r.facilityName)) return false;
            seen.add(r.facilityName);
            return true;
        }) ?? [];
    }, [regionsData]);

    const uniqueAgencies = React.useMemo(() => {
        const seen = new Set<string>();
        return agenciesData?.filter((r) => {
            if (seen.has(r.agency)) return false;
            seen.add(r.agency);
            return true;
        }) ?? [];
    }, [agenciesData]);

    const partnersForSelectedAgency = React.useMemo(() => {
        const seen = new Set<string>();
        return agenciesData?.filter((r) => {
            if (seen.has(r.partnerName)) return false;
            seen.add(r.partnerName);
            return true;
        }) ?? [];
    }, [agenciesData]);


    return (
        <div className="p-4 w-80 bg-white border-r space-y-4 max-h-screen overflow-y-auto">
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

            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange?.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange?.to ? (
                                    <>
                                        {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                                    </>
                                ) : (
                                    format(dateRange.from, "PPP")
                                )
                            ) : (
                                <span>Select date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => setDateRange(range)}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

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
                            : `Select County (${uniqueCounties.length})`}
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

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.subCounty && filters.subCounty.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.subCounty?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.subCounty ?? []).length > 0
                            ? filters?.subCounty?.join(", ")
                            : `Select Sub County (${subCounties.length})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {subCounties.map((region, index) => {
                                const subCountyName = region.subCounty;
                                const selectedSubCounties = filters.subCounty ?? [];
                                const isSelected = selectedSubCounties.includes(subCountyName);

                                return (
                                    <CommandItem
                                        key={`${subCountyName}-${index}`}
                                        onSelect={() => {
                                            const newValue = isSelected
                                                ? selectedSubCounties.filter((s) => s !== subCountyName)
                                                : [...selectedSubCounties, subCountyName];
                                            update("subCounty", newValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {subCountyName}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.facilityName && filters.facilityName.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.facilityName?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.facilityName ?? []).length > 0
                            ? filters?.facilityName?.join(", ")
                            : `Select Facility Name (${facilities.length})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {facilities.map((subCounty, index) => {
                                const name = subCounty.facilityName;
                                const selectedValues = filters.facilityName ?? [];
                                const isSelected = selectedValues.includes(name);

                                return (
                                    <CommandItem
                                        key={`${name}-${index}`}
                                        onSelect={() => {
                                            const newValue = isSelected
                                                ? selectedValues.filter((item) => item !== name)
                                                : [...selectedValues, name];
                                            update("facilityName", newValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.sex && filters.sex.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.sex?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.sex ?? []).length > 0
                            ? filters?.sex?.join(", ")
                            : isLoadingSex
                                ? "Loading Sex..."
                                : `Select Sex (${sexData?.length ?? 0})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {isLoadingSex ? (
                                <CommandItem disabled>Loading...</CommandItem>
                            ) : (
                                sexData?.map((s, index) => {
                                    const label = s.sex;
                                    const selectedValues = filters.sex ?? [];
                                    const isSelected = selectedValues.includes(label);

                                    return (
                                        <CommandItem
                                            key={`${label}-${index}`}
                                            onSelect={() => {
                                                const newValue = isSelected
                                                    ? selectedValues.filter((item) => item !== label)
                                                    : [...selectedValues, label];
                                                update("sex", newValue);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {label}
                                        </CommandItem>
                                    );
                                })
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.ageGroup && filters.ageGroup.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.ageGroup?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.ageGroup ?? []).length > 0
                            ? filters?.ageGroup?.join(", ")
                            : isLoadingAgeGroups
                                ? "Loading Age Category..."
                                : `Select Age Category (${ageGroupsData?.length ?? 0})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {isLoadingAgeGroups ? (
                                <CommandItem disabled>Loading...</CommandItem>
                            ) : (
                                ageGroupsData?.map((ageGroup, index) => {
                                    const label = ageGroup.ageGroup;
                                    const selectedValues = filters.ageGroup ?? [];
                                    const isSelected = selectedValues.includes(label);

                                    return (
                                        <CommandItem
                                            key={`${label}-${index}`}
                                            onSelect={() => {
                                                const newValue = isSelected
                                                    ? selectedValues.filter((item) => item !== label)
                                                    : [...selectedValues, label];
                                                update("ageGroup", newValue);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {label}
                                        </CommandItem>
                                    );
                                })
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.agency && filters.agency.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.agency?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.agency ?? []).length > 0
                            ? filters?.agency?.join(", ")
                            : isLoadingAgencies
                                ? "Loading Agency..."
                                : `Select Agency (${uniqueAgencies?.length ?? 0})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {isLoadingAgencies ? (
                                <CommandItem disabled>Loading...</CommandItem>
                            ) : (
                                uniqueAgencies?.map((agency, index) => {
                                    const name = agency.agency;
                                    const selectedValues = filters.agency ?? [];
                                    const isSelected = selectedValues.includes(name);

                                    return (
                                        <CommandItem
                                            key={`${name}-${index}`}
                                            onSelect={() => {
                                                const newValue = isSelected
                                                    ? selectedValues.filter((item) => item !== name)
                                                    : [...selectedValues, name];
                                                update("agency", newValue);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {name}
                                        </CommandItem>
                                    );
                                })
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left",
                            filters.partner && filters.partner.length > 0 && "bg-green-600 text-white hover:bg-green-700",
                            filters.partner?.length === 0 && "text-muted-foreground"
                        )}
                    >
                        {(filters.partner ?? []).length > 0
                            ? filters?.partner?.join(", ")
                            : `Select Partner (${partnersForSelectedAgency.length})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandGroup>
                            {partnersForSelectedAgency.map((agency, index) => {
                                const name = agency.partnerName;
                                const selectedValues = filters.partner ?? [];
                                const isSelected = selectedValues.includes(name);

                                return (
                                    <CommandItem
                                        key={`${name}-${index}`}
                                        onSelect={() => {
                                            const newValue = isSelected
                                                ? selectedValues.filter((item) => item !== name)
                                                : [...selectedValues, name];
                                            update("partner", newValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Filter and Reset buttons */}
            <Button className="w-full">Filter</Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    setFilters(defaultMapFilters);
                    resetMapView();
                }}
            >
                Reset Filter
            </Button>

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
            {/*<Button className="w-full mt-2" variant="outline">*/}
            {/*    <Download className="mr-2 h-4 w-4" />*/}
            {/*    Download Result*/}
            {/*</Button>*/}
        </div>
    );
};
export default FilterPanel;
