import type { SchemaType } from "@/schemas/types"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"

interface SchemaTypeSelectorProps {
    onSelect: (type: SchemaType) => void
    onClose: () => void
}

const SCHEMA_TYPES: SchemaType[] = [
    "Article",
    "Product",
    "FAQPage",
    "HowTo",
    "LocalBusiness",
    "Organization",
    "Person",
    "Event",
    "Recipe",
    "Review",
    "BreadcrumbList",
    "VideoObject",
    "SoftwareApplication",
]

const SCHEMA_DESCRIPTIONS: Record<SchemaType, string> = {
    Article: "Blog posts, news articles, reports",
    Product: "E-commerce products with pricing & reviews",
    FAQPage: "Frequently asked questions",
    HowTo: "Step-by-step instructions",
    LocalBusiness: "Physical business with address & hours",
    Organization: "Company info, logo, social profiles",
    Person: "Individual profile, job title, bio",
    Event: "Conferences, webinars, meetups",
    Recipe: "Cooking recipes with ingredients & steps",
    Review: "Individual product or service reviews",
    BreadcrumbList: "Navigation breadcrumb trail",
    VideoObject: "Video content metadata",
    SoftwareApplication: "Apps and software products",
}

export default function SchemaTypeSelector({ onSelect, onClose }: SchemaTypeSelectorProps) {
    return (
        <div className="overlay">
            <div className="modal">
                <div className="modal-header">
                    <div>
                        <h2 style={{ fontSize: 14 }}>Add Schema Type</h2>
                        <p style={{ marginTop: 2, fontSize: 10 }}>
                            {SCHEMA_TYPES.length} types -- choose one to add
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        style={{ padding: "4px 8px" }}
                    >
                        x
                    </button>
                </div>

                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {SCHEMA_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                onSelect(type)
                                onClose()
                            }}
                            className="card"
                            style={{ textAlign: "left", width: "100%", padding: 10 }}
                        >
                            <div className="row gap-8">
                                <div className="schema-icon">
                                    {SCHEMA_TYPE_ICONS[type]}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                                        {SCHEMA_TYPE_LABELS[type]}
                                    </div>
                                    <div style={{ fontSize: 10, color: "var(--framer-color-text-secondary)", marginTop: 2 }}>
                                        {SCHEMA_DESCRIPTIONS[type]}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
