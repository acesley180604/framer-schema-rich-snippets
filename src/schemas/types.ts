export type SchemaType =
    | "Article"
    | "NewsArticle"
    | "BlogPosting"
    | "Product"
    | "FAQPage"
    | "HowTo"
    | "LocalBusiness"
    | "Restaurant"
    | "MedicalBusiness"
    | "LegalService"
    | "FinancialService"
    | "RealEstateAgent"
    | "Organization"
    | "Person"
    | "Event"
    | "Recipe"
    | "Review"
    | "BreadcrumbList"
    | "VideoObject"
    | "SoftwareApplication"
    | "Course"
    | "JobPosting"
    | "Book"
    | "Movie"
    | "MusicAlbum"
    | "Dataset"
    | "ItemList"
    | "WebSite"
    | "PodcastEpisode"

export interface SchemaEntry {
    id: string
    type: SchemaType
    name: string
    data: Record<string, unknown>
    createdAt: number
    pageId?: string
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
    level: "error" | "warning" | "info"
    message: string
    suggestion?: string
}

export interface PageEntry {
    id: string
    name: string
    url: string
    schemaIds: string[]
}

export type SchemaCategory =
    | "Content"
    | "Commerce"
    | "Local"
    | "Business"
    | "Events"
    | "Media"
    | "Education"
    | "Jobs"
    | "Navigation"
    | "Technical"

export const SCHEMA_CATEGORIES: Record<SchemaCategory, SchemaType[]> = {
    Content: ["Article", "NewsArticle", "BlogPosting", "FAQPage", "HowTo", "Review"],
    Commerce: ["Product", "SoftwareApplication"],
    Local: ["LocalBusiness", "Restaurant", "MedicalBusiness", "LegalService", "FinancialService", "RealEstateAgent"],
    Business: ["Organization", "Person"],
    Events: ["Event"],
    Media: ["VideoObject", "Movie", "MusicAlbum", "PodcastEpisode"],
    Education: ["Course", "Book", "Dataset"],
    Jobs: ["JobPosting"],
    Navigation: ["BreadcrumbList", "ItemList"],
    Technical: ["WebSite", "Recipe"],
}

export const SCHEMA_TYPE_LABELS: Record<SchemaType, string> = {
    Article: "Article",
    NewsArticle: "News Article",
    BlogPosting: "Blog Post",
    Product: "Product",
    FAQPage: "FAQ Page",
    HowTo: "How-To",
    LocalBusiness: "Local Business",
    Restaurant: "Restaurant",
    MedicalBusiness: "Medical Business",
    LegalService: "Legal Service",
    FinancialService: "Financial Service",
    RealEstateAgent: "Real Estate Agent",
    Organization: "Organization",
    Person: "Person",
    Event: "Event",
    Recipe: "Recipe",
    Review: "Review",
    BreadcrumbList: "Breadcrumb List",
    VideoObject: "Video",
    SoftwareApplication: "Software App",
    Course: "Course",
    JobPosting: "Job Posting",
    Book: "Book",
    Movie: "Movie",
    MusicAlbum: "Music Album",
    Dataset: "Dataset",
    ItemList: "Item List",
    WebSite: "WebSite",
    PodcastEpisode: "Podcast Episode",
}

export const SCHEMA_TYPE_ICONS: Record<SchemaType, string> = {
    Article: "A",
    NewsArticle: "N",
    BlogPosting: "B",
    Product: "P",
    FAQPage: "?",
    HowTo: "H",
    LocalBusiness: "L",
    Restaurant: "R",
    MedicalBusiness: "M",
    LegalService: "J",
    FinancialService: "F",
    RealEstateAgent: "E",
    Organization: "O",
    Person: "U",
    Event: "E",
    Recipe: "R",
    Review: "S",
    BreadcrumbList: "B",
    VideoObject: "V",
    SoftwareApplication: "W",
    Course: "C",
    JobPosting: "J",
    Book: "B",
    Movie: "M",
    MusicAlbum: "A",
    Dataset: "D",
    ItemList: "I",
    WebSite: "W",
    PodcastEpisode: "P",
}

export const SCHEMA_TYPE_DESCRIPTIONS: Record<SchemaType, string> = {
    Article: "Blog posts, news articles, reports",
    NewsArticle: "News and press articles with dateline",
    BlogPosting: "Blog posts with author and comments",
    Product: "E-commerce products with pricing & reviews",
    FAQPage: "Frequently asked questions with accordion",
    HowTo: "Step-by-step instructions and guides",
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

export const RICH_RESULT_INFO: Record<SchemaType, string> = {
    Article: "Enhanced article listing with headline, image, and date in search results",
    NewsArticle: "Top Stories carousel and news-specific rich results",
    BlogPosting: "Enhanced blog listing with author info in search results",
    Product: "Product snippet with price, availability, and star ratings",
    FAQPage: "Expandable FAQ accordion directly in search results",
    HowTo: "Step-by-step instructions with images in search results",
    LocalBusiness: "Google Maps integration, Knowledge Panel, and local pack",
    Restaurant: "Restaurant listing with cuisine, price range, and reviews",
    MedicalBusiness: "Medical practice listing in Google Maps and Knowledge Panel",
    LegalService: "Legal service listing in Google Maps and Knowledge Panel",
    FinancialService: "Financial service listing in Google Maps and Knowledge Panel",
    RealEstateAgent: "Real estate listing in Google Maps and Knowledge Panel",
    Organization: "Knowledge Panel with logo and social links",
    Person: "Knowledge Panel with bio, image, and social links",
    Event: "Event listing with date, location, and ticket info",
    Recipe: "Recipe card with image, rating, cook time, and calories",
    Review: "Review snippet with star rating in search results",
    BreadcrumbList: "Breadcrumb trail replacing URL in search results",
    VideoObject: "Video thumbnail and duration in search results",
    SoftwareApplication: "App listing with rating and download info",
    Course: "Course listing with provider and description",
    JobPosting: "Job listing in Google Jobs with salary info",
    Book: "Book panel with author, reviews, and buy links",
    Movie: "Movie panel with cast, ratings, and showtimes",
    MusicAlbum: "Music panel with tracks and streaming links",
    Dataset: "Dataset listing in Google Dataset Search",
    ItemList: "Carousel or list view in search results",
    WebSite: "Sitelinks search box in search results",
    PodcastEpisode: "Podcast episode in Google Podcasts results",
}
