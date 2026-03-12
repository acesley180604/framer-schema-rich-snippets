import type { SchemaType } from "./types"

export type FieldType =
    | "text"
    | "url"
    | "textarea"
    | "number"
    | "date"
    | "datetime"
    | "select"
    | "faq-list"
    | "step-list"
    | "breadcrumb-list"
    | "string-list"
    | "opening-hours"

export interface FieldDef {
    key: string
    label: string
    type: FieldType
    required: boolean
    recommended?: boolean
    placeholder?: string
    options?: { value: string; label: string }[]
    helpText?: string
    group?: string
}

const AVAILABILITY_OPTIONS = [
    { value: "https://schema.org/InStock", label: "In Stock" },
    { value: "https://schema.org/OutOfStock", label: "Out of Stock" },
    { value: "https://schema.org/PreOrder", label: "Pre-Order" },
    { value: "https://schema.org/BackOrder", label: "Back Order" },
    { value: "https://schema.org/Discontinued", label: "Discontinued" },
    { value: "https://schema.org/LimitedAvailability", label: "Limited Availability" },
]

const CURRENCY_OPTIONS = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "JPY", label: "JPY" },
    { value: "CAD", label: "CAD" },
    { value: "AUD", label: "AUD" },
    { value: "CHF", label: "CHF" },
    { value: "CNY", label: "CNY" },
    { value: "INR", label: "INR" },
    { value: "BRL", label: "BRL" },
]

const EVENT_ATTENDANCE_OPTIONS = [
    { value: "https://schema.org/OfflineEventAttendanceMode", label: "In-Person" },
    { value: "https://schema.org/OnlineEventAttendanceMode", label: "Online" },
    { value: "https://schema.org/MixedEventAttendanceMode", label: "Mixed" },
]

const EVENT_STATUS_OPTIONS = [
    { value: "https://schema.org/EventScheduled", label: "Scheduled" },
    { value: "https://schema.org/EventCancelled", label: "Cancelled" },
    { value: "https://schema.org/EventPostponed", label: "Postponed" },
    { value: "https://schema.org/EventRescheduled", label: "Rescheduled" },
]

const SOFTWARE_CATEGORY_OPTIONS = [
    { value: "BusinessApplication", label: "Business" },
    { value: "GameApplication", label: "Game" },
    { value: "SocialNetworkingApplication", label: "Social Networking" },
    { value: "TravelApplication", label: "Travel" },
    { value: "ShoppingApplication", label: "Shopping" },
    { value: "SportsApplication", label: "Sports" },
    { value: "LifestyleApplication", label: "Lifestyle" },
    { value: "HealthApplication", label: "Health" },
    { value: "EducationalApplication", label: "Education" },
    { value: "DesignApplication", label: "Design" },
    { value: "DeveloperApplication", label: "Developer" },
    { value: "FinanceApplication", label: "Finance" },
    { value: "MultimediaApplication", label: "Multimedia" },
    { value: "UtilitiesApplication", label: "Utilities" },
]

export const SCHEMA_FIELDS: Record<SchemaType, FieldDef[]> = {
    Article: [
        { key: "headline", label: "Headline", type: "text", required: true, placeholder: "Article title" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "Brief description of the article" },
        { key: "image", label: "Image URL", type: "url", required: true, placeholder: "https://example.com/image.jpg" },
        { key: "authorName", label: "Author Name", type: "text", required: true, placeholder: "John Doe" },
        { key: "authorUrl", label: "Author URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/author" },
        { key: "datePublished", label: "Date Published", type: "date", required: true },
        { key: "dateModified", label: "Date Modified", type: "date", required: false, recommended: true },
        { key: "publisherName", label: "Publisher Name", type: "text", required: true, placeholder: "Publisher Inc." },
        { key: "publisherLogo", label: "Publisher Logo URL", type: "url", required: true, placeholder: "https://example.com/logo.png" },
        { key: "articleSection", label: "Section", type: "text", required: false, placeholder: "Technology" },
        { key: "wordCount", label: "Word Count", type: "number", required: false, placeholder: "1500" },
    ],
    Product: [
        { key: "name", label: "Product Name", type: "text", required: true, placeholder: "Product name" },
        { key: "description", label: "Description", type: "textarea", required: true, placeholder: "Product description" },
        { key: "image", label: "Image URL", type: "url", required: true, placeholder: "https://example.com/product.jpg" },
        { key: "sku", label: "SKU", type: "text", required: false, recommended: true, placeholder: "SKU-12345" },
        { key: "brand", label: "Brand", type: "text", required: false, recommended: true, placeholder: "Brand Name" },
        { key: "price", label: "Price", type: "number", required: true, placeholder: "29.99", group: "offers" },
        { key: "priceCurrency", label: "Currency", type: "select", required: true, options: CURRENCY_OPTIONS, group: "offers" },
        { key: "availability", label: "Availability", type: "select", required: true, options: AVAILABILITY_OPTIONS, group: "offers" },
        { key: "ratingValue", label: "Rating Value", type: "number", required: false, recommended: true, placeholder: "4.5", group: "rating" },
        { key: "ratingCount", label: "Rating Count", type: "number", required: false, placeholder: "120", group: "rating" },
        { key: "bestRating", label: "Best Rating", type: "number", required: false, placeholder: "5", group: "rating" },
        { key: "reviewCount", label: "Review Count", type: "number", required: false, placeholder: "85", group: "rating" },
    ],
    FAQPage: [
        { key: "faqItems", label: "FAQ Items", type: "faq-list", required: true, helpText: "Add question and answer pairs" },
    ],
    HowTo: [
        { key: "name", label: "Title", type: "text", required: true, placeholder: "How to do something" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "A description of the how-to guide" },
        { key: "image", label: "Image URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/howto.jpg" },
        { key: "totalTime", label: "Total Time (ISO 8601)", type: "text", required: false, recommended: true, placeholder: "PT30M", helpText: "e.g. PT30M = 30 minutes, PT1H = 1 hour" },
        { key: "estimatedCost", label: "Estimated Cost", type: "text", required: false, placeholder: "50 USD" },
        { key: "supply", label: "Supplies Needed", type: "string-list", required: false, helpText: "List of supplies needed" },
        { key: "tool", label: "Tools Needed", type: "string-list", required: false, helpText: "List of tools needed" },
        { key: "steps", label: "Steps", type: "step-list", required: true, helpText: "Add step-by-step instructions" },
    ],
    LocalBusiness: [
        { key: "name", label: "Business Name", type: "text", required: true, placeholder: "Business Name" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "Brief description of the business" },
        { key: "image", label: "Image URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/business.jpg" },
        { key: "telephone", label: "Phone Number", type: "text", required: false, recommended: true, placeholder: "+1-555-123-4567" },
        { key: "url", label: "Website URL", type: "url", required: false, recommended: true, placeholder: "https://example.com" },
        { key: "priceRange", label: "Price Range", type: "text", required: false, recommended: true, placeholder: "$$", helpText: "e.g. $, $$, $$$, or $10-$50" },
        { key: "streetAddress", label: "Street Address", type: "text", required: true, placeholder: "123 Main St", group: "address" },
        { key: "addressLocality", label: "City", type: "text", required: true, placeholder: "San Francisco", group: "address" },
        { key: "addressRegion", label: "State/Region", type: "text", required: true, placeholder: "CA", group: "address" },
        { key: "postalCode", label: "Postal Code", type: "text", required: true, placeholder: "94102", group: "address" },
        { key: "addressCountry", label: "Country", type: "text", required: true, placeholder: "US", group: "address" },
        { key: "latitude", label: "Latitude", type: "text", required: false, recommended: true, placeholder: "37.7749", group: "geo" },
        { key: "longitude", label: "Longitude", type: "text", required: false, recommended: true, placeholder: "-122.4194", group: "geo" },
        { key: "openingHours", label: "Opening Hours", type: "opening-hours", required: false, recommended: true, group: "hours" },
    ],
    Organization: [
        { key: "name", label: "Organization Name", type: "text", required: true, placeholder: "Organization Name" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "Brief description" },
        { key: "url", label: "Website URL", type: "url", required: true, placeholder: "https://example.com" },
        { key: "logo", label: "Logo URL", type: "url", required: true, placeholder: "https://example.com/logo.png" },
        { key: "email", label: "Email", type: "text", required: false, placeholder: "info@example.com" },
        { key: "telephone", label: "Phone", type: "text", required: false, placeholder: "+1-555-123-4567" },
        { key: "foundingDate", label: "Founding Date", type: "date", required: false },
        { key: "contactType", label: "Contact Type", type: "text", required: false, placeholder: "customer service", group: "contact" },
        { key: "contactTelephone", label: "Contact Phone", type: "text", required: false, placeholder: "+1-555-123-4567", group: "contact" },
        { key: "sameAs", label: "Social Profiles", type: "string-list", required: false, recommended: true, helpText: "URLs of social media profiles" },
    ],
    Person: [
        { key: "name", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
        { key: "jobTitle", label: "Job Title", type: "text", required: false, recommended: true, placeholder: "Software Engineer" },
        { key: "description", label: "Description", type: "textarea", required: false, placeholder: "Brief bio" },
        { key: "url", label: "Website URL", type: "url", required: false, recommended: true, placeholder: "https://example.com" },
        { key: "image", label: "Image URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/photo.jpg" },
        { key: "email", label: "Email", type: "text", required: false, placeholder: "john@example.com" },
        { key: "telephone", label: "Phone", type: "text", required: false, placeholder: "+1-555-123-4567" },
        { key: "worksForName", label: "Works For (Organization)", type: "text", required: false, placeholder: "Company Name" },
        { key: "worksForUrl", label: "Works For URL", type: "url", required: false, placeholder: "https://company.com" },
        { key: "sameAs", label: "Social Profiles", type: "string-list", required: false, recommended: true, helpText: "URLs of social media profiles" },
    ],
    Event: [
        { key: "name", label: "Event Name", type: "text", required: true, placeholder: "Event name" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "Event description" },
        { key: "image", label: "Image URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/event.jpg" },
        { key: "startDate", label: "Start Date", type: "datetime", required: true },
        { key: "endDate", label: "End Date", type: "datetime", required: false, recommended: true },
        { key: "eventAttendanceMode", label: "Attendance Mode", type: "select", required: false, recommended: true, options: EVENT_ATTENDANCE_OPTIONS },
        { key: "eventStatus", label: "Event Status", type: "select", required: false, recommended: true, options: EVENT_STATUS_OPTIONS },
        { key: "locationName", label: "Venue Name", type: "text", required: false, recommended: true, placeholder: "Convention Center", group: "location" },
        { key: "locationAddress", label: "Venue Address", type: "text", required: false, placeholder: "123 Main St, City, State", group: "location" },
        { key: "locationUrl", label: "Online Event URL", type: "url", required: false, placeholder: "https://zoom.us/...", group: "location" },
        { key: "performerName", label: "Performer Name", type: "text", required: false, placeholder: "Band Name or Speaker" },
        { key: "organizerName", label: "Organizer Name", type: "text", required: false, recommended: true, placeholder: "Organizer" },
        { key: "organizerUrl", label: "Organizer URL", type: "url", required: false, placeholder: "https://organizer.com" },
        { key: "offerPrice", label: "Ticket Price", type: "number", required: false, placeholder: "50", group: "offers" },
        { key: "offerCurrency", label: "Currency", type: "select", required: false, options: CURRENCY_OPTIONS, group: "offers" },
        { key: "offerAvailability", label: "Availability", type: "select", required: false, options: AVAILABILITY_OPTIONS, group: "offers" },
        { key: "offerUrl", label: "Ticket URL", type: "url", required: false, placeholder: "https://tickets.example.com", group: "offers" },
    ],
    Recipe: [
        { key: "name", label: "Recipe Name", type: "text", required: true, placeholder: "Recipe name" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "Recipe description" },
        { key: "image", label: "Image URL", type: "url", required: true, placeholder: "https://example.com/recipe.jpg" },
        { key: "authorName", label: "Author", type: "text", required: false, recommended: true, placeholder: "Chef Name" },
        { key: "prepTime", label: "Prep Time (ISO 8601)", type: "text", required: false, recommended: true, placeholder: "PT15M", helpText: "e.g. PT15M = 15 minutes" },
        { key: "cookTime", label: "Cook Time (ISO 8601)", type: "text", required: false, recommended: true, placeholder: "PT30M" },
        { key: "totalTime", label: "Total Time (ISO 8601)", type: "text", required: false, placeholder: "PT45M" },
        { key: "recipeYield", label: "Yield / Servings", type: "text", required: false, recommended: true, placeholder: "4 servings" },
        { key: "recipeCategory", label: "Category", type: "text", required: false, placeholder: "Dinner" },
        { key: "recipeCuisine", label: "Cuisine", type: "text", required: false, placeholder: "Italian" },
        { key: "calories", label: "Calories", type: "text", required: false, placeholder: "350 calories" },
        { key: "recipeIngredient", label: "Ingredients", type: "string-list", required: true, helpText: "One ingredient per line" },
        { key: "recipeInstructions", label: "Instructions", type: "step-list", required: true, helpText: "Step-by-step instructions" },
        { key: "ratingValue", label: "Rating Value", type: "number", required: false, placeholder: "4.5", group: "rating" },
        { key: "ratingCount", label: "Rating Count", type: "number", required: false, placeholder: "50", group: "rating" },
    ],
    Review: [
        { key: "itemReviewedName", label: "Item Reviewed", type: "text", required: true, placeholder: "Product or service name" },
        { key: "itemReviewedType", label: "Item Type", type: "select", required: false, options: [
            { value: "Product", label: "Product" },
            { value: "LocalBusiness", label: "Local Business" },
            { value: "Movie", label: "Movie" },
            { value: "Book", label: "Book" },
            { value: "Restaurant", label: "Restaurant" },
            { value: "SoftwareApplication", label: "Software" },
            { value: "CreativeWork", label: "Creative Work" },
        ] },
        { key: "authorName", label: "Reviewer Name", type: "text", required: true, placeholder: "John Doe" },
        { key: "authorUrl", label: "Reviewer URL", type: "url", required: false, placeholder: "https://example.com/author" },
        { key: "ratingValue", label: "Rating Value", type: "number", required: true, placeholder: "4", group: "rating" },
        { key: "bestRating", label: "Best Rating", type: "number", required: false, placeholder: "5", group: "rating" },
        { key: "worstRating", label: "Worst Rating", type: "number", required: false, placeholder: "1", group: "rating" },
        { key: "reviewBody", label: "Review Body", type: "textarea", required: true, placeholder: "Write the full review text here..." },
        { key: "datePublished", label: "Date Published", type: "date", required: false, recommended: true },
        { key: "publisher", label: "Publisher Name", type: "text", required: false, placeholder: "Review Site Name" },
    ],
    BreadcrumbList: [
        { key: "breadcrumbs", label: "Breadcrumb Items", type: "breadcrumb-list", required: true, helpText: "Ordered list of pages in the breadcrumb trail" },
    ],
    VideoObject: [
        { key: "name", label: "Video Title", type: "text", required: true, placeholder: "Video title" },
        { key: "description", label: "Description", type: "textarea", required: true, placeholder: "Video description" },
        { key: "thumbnailUrl", label: "Thumbnail URL", type: "url", required: true, placeholder: "https://example.com/thumb.jpg" },
        { key: "uploadDate", label: "Upload Date", type: "date", required: true },
        { key: "duration", label: "Duration (ISO 8601)", type: "text", required: false, recommended: true, placeholder: "PT5M30S", helpText: "e.g. PT5M30S = 5 min 30 sec" },
        { key: "contentUrl", label: "Content URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/video.mp4" },
        { key: "embedUrl", label: "Embed URL", type: "url", required: false, recommended: true, placeholder: "https://youtube.com/embed/..." },
        { key: "interactionCount", label: "View Count", type: "number", required: false, placeholder: "1500000" },
    ],
    SoftwareApplication: [
        { key: "name", label: "App Name", type: "text", required: true, placeholder: "App name" },
        { key: "description", label: "Description", type: "textarea", required: false, recommended: true, placeholder: "App description" },
        { key: "image", label: "Image/Icon URL", type: "url", required: false, recommended: true, placeholder: "https://example.com/icon.png" },
        { key: "operatingSystem", label: "Operating System", type: "text", required: false, recommended: true, placeholder: "Windows, macOS, Android, iOS" },
        { key: "applicationCategory", label: "Category", type: "select", required: false, recommended: true, options: SOFTWARE_CATEGORY_OPTIONS },
        { key: "price", label: "Price", type: "number", required: false, recommended: true, placeholder: "0", group: "offers" },
        { key: "priceCurrency", label: "Currency", type: "select", required: false, options: CURRENCY_OPTIONS, group: "offers" },
        { key: "ratingValue", label: "Rating Value", type: "number", required: false, recommended: true, placeholder: "4.5", group: "rating" },
        { key: "ratingCount", label: "Rating Count", type: "number", required: false, placeholder: "200", group: "rating" },
        { key: "bestRating", label: "Best Rating", type: "number", required: false, placeholder: "5", group: "rating" },
        { key: "downloadUrl", label: "Download URL", type: "url", required: false, placeholder: "https://example.com/download" },
        { key: "softwareVersion", label: "Version", type: "text", required: false, placeholder: "1.0.0" },
    ],
}
