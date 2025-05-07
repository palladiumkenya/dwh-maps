export function Header() {
    return (
        <div className="w-full flex items-center p-4 bg-white border-b shadow-sm">
            {/* Left: Logos with spacing */}
            <div className="flex items-center gap-4">
                <img
                    src="/logos/IMG_0741.PNG"
                    alt="MOH"
                    className="h-10 object-contain"
                />
                <img
                    src="/logos/IMG_0742.PNG"
                    alt="CDC"
                    className="h-10 object-contain"
                />
            </div>

            {/* Spacer between logos and title */}
            <div className="w-6" />

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800">
                HIV Surveillance Investigation
            </h1>
        </div>
    );
}
