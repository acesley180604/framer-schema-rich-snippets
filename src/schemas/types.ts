export type SchemaType =
    | "Article"
    | "Product"
    | "FAQPage"
    | "HowTo"
    | "LocalBusiness"
    | "Organization"
    | "Person"
    | "Event"
    | "Recipe"
    | "Review"
    | "BreadcrumbList"
    | "VideoObject"
    | "SoftwareApplication"

export interface SchemaEntry {
    id: string
    type: SchemaType
    name: string
    data: Record<string, unknown>
    createdAt: number
}

export interface FAQItem {
    question: string
    answer: string
}

export interface HowToStep {
    name: string
    text: string
    image?: string
}

export interface BreadcrumbItem {
    name: string
    url: string
}

export interface OfferData {
    price: string
    priceCurrency: string
    availability: string
    url?: string
}

export interface RatingData {
    ratingValue: string
    bestRating: string
    worstRating?: string
    ratingCount?: string
}

export interface ContactPointData {
    telephone: string
    contactType: string
    areaServed?: string
    availableLanguage?: string
}

export interface PostalAddressData {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
}

export interface GeoData {
    latitude: string
    longitude: string
}

export interface OpeningHoursData {
    dayOfWeek: string[]
    opens: string
    closes: string
}

export interface ValidationResult {
    field: string
    level: "error" | "warning"
    message: string
}

export const SCHEMA_TYPE_LABELS: Record<SchemaType, string> = {
    Article: "Article",
    Product: "Product",
    FAQPage: "FAQ",
    HowTo: "How-To",
    LocalBusiness: "Local Business",
    Organization: "Organization",
    Person: "Person",
    Event: "Event",
    Recipe: "Recipe",
    Review: "Review",
    BreadcrumbList: "Breadcrumb List",
    VideoObject: "Video",
    SoftwareApplication: "Software App",
}

export const SCHEMA_TYPE_ICONS: Record<SchemaType, string> = {
    Article: "A",
    Product: "P",
    FAQPage: "?",
    HowTo: "H",
    LocalBusiness: "L",
    Organization: "O",
    Person: "U",
    Event: "E",
    Recipe: "R",
    Review: "S",
    BreadcrumbList: "B",
    VideoObject: "V",
    SoftwareApplication: "W",
}
