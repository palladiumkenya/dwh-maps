import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
    {
        label: "Home",
        tooltip: "Project landing page with summaries of available information products",
        href: "https://analytics.nascop.org",
    },
    {
        label: "Real Time Dashboards",
        tooltip: "Dashboards showing continuously updated data to monitor HIV trends, detect gaps, and support immediate public health response",
        href: "https://analytics.nascop.org/superset/dashboard/1307",
    },
    {
        label: "Sentinel Events Pathways",
        tooltip: "Dashboards that visualize patient journeys and flag sentinel events that point to possible clinical or programmatic gaps requiring public health action",
        href: "https://sentinel.nascop.org/",
    },
    {
        label: "Cohort Dashboards",
        tooltip: "Dashboards that track individuals over time, highlighting gaps in care, treatment outcomes, and opportunities for public health action to improve HIV program performance.",
        href: "https://analytics.nascop.org/superset/dashboard/1287/",
    },
    {
        label: "Epidemic Surveillance Report",
        tooltip: "A report summarising public health responses to HIV surveillance data, highlighting actions taken, outcomes achieved, and areas for improvement to optimise intervention strategies.",
    },
];

export const NavigationHeader = () => {
    return (
        <div className="relative bg-purple-700 text-white text-base font-semibold shadow overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/banner/Element.png"
                    alt="banner"
                    className="w-full h-full object-cover opacity-100"
                />
            </div>

            <div className="relative z-10 flex justify-center items-center space-x-12 py-10">
                {navItems.map(({ label, tooltip, href }) => (
                    <Tooltip key={label}>
                        <TooltipTrigger asChild>
                            {href ? (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-300 hover:underline transition-colors"
                                >
                                    {label}
                                </a>
                            ) : (
                                <button className="hover:text-gray-300 hover:underline transition-colors">
                                    {label}
                                </button>
                            )}
                        </TooltipTrigger>
                        <TooltipContent side="bottom">{tooltip}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};
