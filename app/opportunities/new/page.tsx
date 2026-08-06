"use client"
import { useState, useRef } from "react";
import { UNSPECIFIED_LOCATION_LABEL, VOLUNTEER_CATEGORIES } from "@/lib/opportunityOptions";
import { redirect } from "next/navigation";

export default function NewOpportunity() {
    const [online, setOnline] = useState(false);
    const [locationUnspecified, setLocationUnspecified] = useState(false);
    const [descriptionText, setDescriptionText] = useState("");
    const locationInputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // Get all form data
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        let link = formData.get("link") as string;
        const category = formData.get("category") as string;
        const environment = formData.get("environment") as string | null;
        // Verify form data
        if (!title || !description || !link || !category) {
            alert("Please fill in all required fields.");
            return;
        }
        // Check link after adding http:// or https:// if not present
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            link = "https://" + link;
        }
        // Test link is valid URL
        try {
            new URL(link);
        } catch (error) {
            alert("Please enter a valid URL for the link.");
            return;
        }
        // Submit form data to API route
        fetch("/api/opportunities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                location: online ? "Online" : locationUnspecified ? UNSPECIFIED_LOCATION_LABEL : location,
                link,
                category,
                environment: online ? null : environment,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).catch((error) => {
            console.error("Error submitting form:", error);
            alert("There was an error submitting the form. Please try again.");
        });
        
        redirect("/opportunities");

    }

    return (
        <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
            <main className="w-full max-w-6xl">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                            Suggest a New Opportunity
                        </p>
                        <h1 className="text-3xl font-semibold text-slate-900">
                            Share a way to give back
                        </h1>
                    </div>
                </div>
                <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                maxLength={100}
                                className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                maxLength={1000}
                                className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 sm:text-sm"
                                onChange={(e) => setDescriptionText(e.target.value)}
                            ></textarea>
                            <p className="text-sm text-slate-500">
                                {descriptionText.length}/1000
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                ref={locationInputRef}
                                maxLength={500}
                                required={!online && !locationUnspecified}
                                disabled={online || locationUnspecified}
                                placeholder={locationUnspecified ? UNSPECIFIED_LOCATION_LABEL : "City, State or Address"}
                                className={"flex-1 mt-1 block rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 sm:text-sm" + (online || locationUnspecified ? " bg-slate-100 cursor-not-allowed" : " bg-white")}
                            />

                            <div className="flex items-center gap-2 ml-4">
                                <input
                                    type="checkbox"
                                    id="online"
                                    name="online"
                                    checked={online}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setOnline(checked);
                                        locationInputRef.current!.value = "";
                                        if (checked) {
                                            setLocationUnspecified(false);
                                        }
                                    }}
                                    className="h-5 w-5 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <label htmlFor="online" className="block text-sm font-medium text-slate-700">
                                    Online
                                </label>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <input
                                    type="checkbox"
                                    id="locationUnspecified"
                                    name="locationUnspecified"
                                    checked={locationUnspecified}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setLocationUnspecified(checked);
                                        locationInputRef.current!.value = "";
                                        if (checked) {
                                            setOnline(false);
                                        }
                                    }}
                                    className="h-5 w-5 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <label htmlFor="locationUnspecified" className="block text-sm font-medium text-slate-700">
                                    Unspecified
                                </label>
                            </div>
                        </div>
                        <input
                            type="hidden"
                            name="locationMode"
                            value={online ? "online" : locationUnspecified ? "unspecified" : "specified"}
                        />
                        <div>
                            <label htmlFor="link" className="block text-sm font-medium text-slate-700">
                                Link
                            </label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                required
                                placeholder="https://example.org/volunteer"
                                className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 sm:text-sm"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {VOLUNTEER_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={(online ? "hidden" : "")}>
                            <p className="block text-sm font-medium text-slate-700 items-center mb-1">
                                Environment
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="indoor"
                                    name="environment"
                                    value="indoor"
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                                    defaultChecked={true}
                                />
                                <label htmlFor="indoor" className="ml-2 text-sm text-slate-700">
                                    Indoor
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="outdoor"
                                    name="environment"
                                    value="outdoor"
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                                />
                                <label htmlFor="outdoor" className="ml-2 text-sm text-slate-700">
                                    Outdoor
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="both"
                                    name="environment"
                                    value="both"
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                                />
                                <label htmlFor="both" className="ml-2 text-sm text-slate-700">
                                    Both
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-full bg-sky-600 px-6 py-3 text-center font-medium text-white transition hover:bg-sky-700"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}