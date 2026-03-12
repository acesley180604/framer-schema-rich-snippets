import type { SchemaType } from "@/schemas/types"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"

interface SchemaTypeSelectorProps {
    onSelect: (type: SchemaType) => void
    onClose: () => void
}

const SCHEMA_TYPES: SchemaType[] = [
    "Article",
    "NewsArticle",
    "BlogPosting",
    "Product",
    "FAQPage",
    "HowTo",
    "LocalBusiness",
    "Restaurant",
    "MedicalBusiness",
    "LegalService",
    "FinancialService",
    "RealEstateAgent",
    "Organization",
    "Person",
    "Event",
    "Recipe",
    "Review",
    "BreadcrumbList",
    "VideoObject",
    "SoftwareApplication",
    "Course",
    "JobPosting",
    "Book",
    "Movie",
    "MusicAlbum",
    "Dataset",
    "ItemList",
    "WebSite",
    "PodcastEpisode",
]

const SCHEMA_DESCRIPTIONS: Record<SchemaType, string> = {
    Article: "Blog posts, news articles, reports",
    NewsArticle: "News and press articles with dateline",
    BlogPosting: "Blog posts with author and comments",
    Product: "E-commerce products with pricing & reviews",
    FAQPage: "Frequently asked questions",
    HowTo: "Step-by-step instructions",
    LocalBusiness: "Physical business with address & hours",
    Restaurant: "Restaurant with menu, cuisine, hours",
    MedicalBusiness: "Medical practice, hospital, pharmacy",
    LegalService: "Law firm, attorney, legal service",
    FinancialService: "Bank, accounting, financial advisor",
    RealEstateAgent: "Real estate agent or agency",
    Organization: "Company info, logo, social profiles",
    Person: "Individual profile, job title, bio",
    Event: "Conferences, webinars, meetups",
    Recipe: "Cooking recipes with ingredients & steps",
    Review: "Individual product or service reviews",
    BreadcrumbList: "Navigation breadcrumb trail",
    VideoObject: "Video content metadata",
    SoftwareApplication: "Apps and software products",
    Course: "Online courses and educational content",
    JobPosting: "Job listings with salary and location",
    Book: "Books with author, ISBN, publisher",
    Movie: "Movies with director, cast, ratings",
    MusicAlbum: "Music albums with tracks and artist",
    Dataset: "Datasets with distribution info",
    ItemList: "Ordered or unordered lists of items",
    WebSite: "Website with search action for sitelinks",
    PodcastEpisode: "Podcast episodes with series info",
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
