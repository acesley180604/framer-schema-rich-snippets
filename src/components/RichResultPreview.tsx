import { useMemo } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { generateJsonLd } from "@/utils/jsonld"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"

export default function RichResultPreview() {
    const { activeSchema, schemas } = useSchemaStore()
    const schema = activeSchema()

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to preview. Add one from the Schemas tab.</p>
            </div>
        )
    }

    if (!schema) {
        return (
            <div className="empty-state">
                <p>Select a schema to preview its rich result appearance.</p>
            </div>
        )
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Rich Result Preview</h2>
                <p style={{ marginTop: 4 }}>
                    Approximate preview of how your schema may appear in Google search results.
                </p>
            </section>

            <div className="info-box info-box-default" style={{ fontSize: 10 }}>
                This is an approximation. Actual appearance depends on Google&apos;s rendering and your page content.
            </div>

            <div className="rich-preview-container">
                <RichResultCard schema={schema} />
            </div>

            <p style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", textAlign: "center" }}>
                Previewing: {schema.name} ({SCHEMA_TYPE_LABELS[schema.type]})
            </p>
        </div>
    )
}

function RichResultCard({ schema }: { schema: { type: string; data: Record<string, unknown>; name: string } }) {
    const jsonld = useMemo(() => generateJsonLd(schema as Parameters<typeof generateJsonLd>[0]), [schema])
    const type = schema.type

    // Common Google search result wrapper
    const SearchResultWrapper = ({ children, url, title, description }: {
        children?: React.ReactNode
        url?: string
        title?: string
        description?: string
    }) => (
        <div className="google-result">
            <div className="google-result-url">
                {url || "example.com"}
            </div>
            <div className="google-result-title">
                {title || "Page Title"}
            </div>
            {description && (
                <div className="google-result-description">
                    {description}
                </div>
            )}
            {children}
        </div>
    )

    switch (type) {
        case "FAQPage": {
            const items = (schema.data.faqItems as Array<{ question: string; answer: string }>) || []
            return (
                <SearchResultWrapper
                    url="example.com > faq"
                    title="Frequently Asked Questions"
                    description="Find answers to common questions about our product and services."
                >
                    <div className="google-faq">
                        {items.slice(0, 3).map((item, i) => (
                            <div key={i} className="google-faq-item">
                                <div className="google-faq-q">
                                    <span className="google-faq-arrow">&#9660;</span>
                                    {item.question || "Question text"}
                                </div>
                                <div className="google-faq-a">
                                    {item.answer || "Answer text"}
                                </div>
                            </div>
                        ))}
                    </div>
                </SearchResultWrapper>
            )
        }

        case "Product": {
            const data = schema.data
            const rating = data.ratingValue ? Number(data.ratingValue) : 0
            const stars = "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(rating))
            return (
                <SearchResultWrapper
                    url="example.com > products"
                    title={(data.name as string) || "Product Name"}
                    description={(data.description as string) || "Product description"}
                >
                    <div className="google-product-info">
                        {data.ratingValue && (
                            <span className="google-stars">
                                {stars} {data.ratingValue}
                                {data.ratingCount && <span> ({data.ratingCount} reviews)</span>}
                            </span>
                        )}
                        {data.price && (
                            <span className="google-price">
                                {data.priceCurrency || "$"}{data.price}
                                {data.availability === "https://schema.org/InStock" && (
                                    <span className="google-in-stock"> - In stock</span>
                                )}
                            </span>
                        )}
                    </div>
                </SearchResultWrapper>
            )
        }

        case "Recipe": {
            const data = schema.data
            const rating = data.ratingValue ? Number(data.ratingValue) : 0
            const stars = "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
            return (
                <div className="google-result">
                    <div className="google-recipe-card">
                        <div className="google-recipe-image">
                            {data.image ? "IMG" : "No image"}
                        </div>
                        <div className="google-recipe-info">
                            <div className="google-result-title" style={{ fontSize: 14 }}>
                                {(data.name as string) || "Recipe Name"}
                            </div>
                            <div className="google-result-url" style={{ marginTop: 2 }}>
                                {(data.authorName as string) || "example.com"}
                            </div>
                            {data.ratingValue && (
                                <div className="google-stars" style={{ marginTop: 4 }}>
                                    {stars} {data.ratingValue}
                                    {data.ratingCount && <span> ({data.ratingCount})</span>}
                                </div>
                            )}
                            <div className="google-recipe-meta">
                                {data.totalTime && <span>{formatDuration(data.totalTime as string)}</span>}
                                {data.calories && <span>{data.calories as string}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        case "Event": {
            const data = schema.data
            return (
                <SearchResultWrapper
                    url="example.com > events"
                    title={(data.name as string) || "Event Name"}
                    description={(data.description as string) || "Event description"}
                >
                    <div className="google-event-info">
                        {data.startDate && (
                            <div className="google-event-date">
                                {formatDate(data.startDate as string)}
                            </div>
                        )}
                        {data.locationName && (
                            <div className="google-event-location">
                                {data.locationName as string}
                            </div>
                        )}
                    </div>
                </SearchResultWrapper>
            )
        }

        case "HowTo": {
            const steps = (schema.data.steps as Array<{ name: string; text: string }>) || []
            return (
                <SearchResultWrapper
                    url="example.com > guides"
                    title={(schema.data.name as string) || "How To Guide"}
                    description={(schema.data.description as string) || "Step-by-step guide"}
                >
                    <div className="google-howto">
                        {steps.slice(0, 4).map((step, i) => (
                            <div key={i} className="google-howto-step">
                                <span className="google-howto-num">{i + 1}</span>
                                <span>{step.name || step.text || `Step ${i + 1}`}</span>
                            </div>
                        ))}
                        {steps.length > 4 && (
                            <div className="google-howto-more">
                                + {steps.length - 4} more steps
                            </div>
                        )}
                    </div>
                </SearchResultWrapper>
            )
        }

        case "BreadcrumbList": {
            const breadcrumbs = (schema.data.breadcrumbs as Array<{ name: string; url: string }>) || []
            return (
                <SearchResultWrapper
                    title="Page Title"
                    description="Page description would appear here."
                >
                    <div className="google-breadcrumbs" style={{ marginTop: -8, marginBottom: 4 }}>
                        {breadcrumbs.map((b, i) => (
                            <span key={i}>
                                {i > 0 && <span className="google-breadcrumb-sep"> &gt; </span>}
                                <span className="google-breadcrumb-item">{b.name || "Page"}</span>
                            </span>
                        ))}
                    </div>
                </SearchResultWrapper>
            )
        }

        case "JobPosting": {
            const data = schema.data
            return (
                <div className="google-result">
                    <div className="google-job-card">
                        <div className="google-result-title" style={{ fontSize: 14, color: "#1a0dab" }}>
                            {(data.title as string) || "Job Title"}
                        </div>
                        <div style={{ fontSize: 12, color: "#202124", marginTop: 4 }}>
                            {(data.hiringOrganizationName as string) || "Company"}
                            {data.addressLocality && <span> - {data.addressLocality as string}</span>}
                            {data.remote === "true" && <span> (Remote)</span>}
                        </div>
                        {(data.salaryValue || data.salaryMinValue) && (
                            <div style={{ fontSize: 12, color: "#70757a", marginTop: 4 }}>
                                Salary: {data.salaryCurrency || "$"}
                                {data.salaryMinValue && data.salaryMaxValue
                                    ? `${Number(data.salaryMinValue).toLocaleString()} - ${Number(data.salaryMaxValue).toLocaleString()}`
                                    : data.salaryValue
                                      ? Number(data.salaryValue as string).toLocaleString()
                                      : ""}
                                {data.salaryUnit && ` / ${(data.salaryUnit as string).toLowerCase()}`}
                            </div>
                        )}
                        {data.datePosted && (
                            <div style={{ fontSize: 11, color: "#70757a", marginTop: 4 }}>
                                Posted: {formatDate(data.datePosted as string)}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        default: {
            // Generic preview
            const title = (jsonld.name || jsonld.headline || jsonld.title || schema.name) as string
            const description = (jsonld.description || "") as string
            return (
                <SearchResultWrapper
                    url="example.com"
                    title={title}
                    description={description}
                >
                    <div style={{ fontSize: 10, color: "#70757a", marginTop: 4 }}>
                        Schema type: {SCHEMA_TYPE_LABELS[schema.type as keyof typeof SCHEMA_TYPE_LABELS] || schema.type}
                    </div>
                </SearchResultWrapper>
            )
        }
    }
}

function formatDuration(iso: string): string {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return iso
    const hours = match[1] ? `${match[1]} hr` : ""
    const minutes = match[2] ? `${match[2]} min` : ""
    return [hours, minutes].filter(Boolean).join(" ")
}

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    } catch {
        return dateStr
    }
}
