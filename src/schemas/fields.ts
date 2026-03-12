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
    | "item-list"

export type FieldImportance = "required" | "recommended" | "optional"

export interface FieldDef {
    key: string
    label: string
    type: FieldType
    required: boolean
    recommended?: boolean
    importance: FieldImportance
    placeholder?: string
    options?: { value: string; label: string }[]
    helpText?: string
    group?: string
    googleRequirement?: string
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

const EMPLOYMENT_TYPE_OPTIONS = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACTOR", label: "Contractor" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "INTERN", label: "Intern" },
    { value: "VOLUNTEER", label: "Volunteer" },
    { value: "PER_DIEM", label: "Per Diem" },
    { value: "OTHER", label: "Other" },
]

const BOOK_FORMAT_OPTIONS = [
    { value: "https://schema.org/Hardcover", label: "Hardcover" },
    { value: "https://schema.org/Paperback", label: "Paperback" },
    { value: "https://schema.org/EBook", label: "E-Book" },
    { value: "https://schema.org/AudiobookFormat", label: "Audiobook" },
]

// Helper to create field defs with importance
function field(
    key: string,
    label: string,
    type: FieldType,
    importance: FieldImportance,
    opts?: Partial<FieldDef>
): FieldDef {
    return {
        key,
        label,
        type,
        required: importance === "required",
        recommended: importance === "recommended",
        importance,
        ...opts,
    }
}

const ARTICLE_FIELDS: FieldDef[] = [
    field("headline", "Headline", "text", "required", { placeholder: "Article title", googleRequirement: "Required for Article rich results" }),
    field("description", "Description", "textarea", "recommended", { placeholder: "Brief description of the article" }),
    field("image", "Image URL", "url", "required", { placeholder: "https://example.com/image.jpg", googleRequirement: "Must be at least 1200px wide" }),
    field("authorName", "Author Name", "text", "required", { placeholder: "John Doe" }),
    field("authorUrl", "Author URL", "url", "recommended", { placeholder: "https://example.com/author" }),
    field("datePublished", "Date Published", "date", "required"),
    field("dateModified", "Date Modified", "date", "recommended"),
    field("publisherName", "Publisher Name", "text", "required", { placeholder: "Publisher Inc." }),
    field("publisherLogo", "Publisher Logo URL", "url", "required", { placeholder: "https://example.com/logo.png" }),
    field("articleSection", "Section", "text", "optional", { placeholder: "Technology" }),
    field("wordCount", "Word Count", "number", "optional", { placeholder: "1500" }),
]

export const SCHEMA_FIELDS: Record<SchemaType, FieldDef[]> = {
    Article: ARTICLE_FIELDS,

    NewsArticle: [
        ...ARTICLE_FIELDS,
        field("dateline", "Dateline", "text", "recommended", { placeholder: "NEW YORK, March 13", helpText: "Location and date where the article was written" }),
    ],

    BlogPosting: [
        ...ARTICLE_FIELDS,
        field("commentCount", "Comment Count", "number", "optional", { placeholder: "42" }),
    ],

    Product: [
        field("name", "Product Name", "text", "required", { placeholder: "Product name", googleRequirement: "Required for Product rich results" }),
        field("description", "Description", "textarea", "required", { placeholder: "Product description" }),
        field("image", "Image URL", "url", "required", { placeholder: "https://example.com/product.jpg" }),
        field("sku", "SKU", "text", "recommended", { placeholder: "SKU-12345" }),
        field("brand", "Brand", "text", "recommended", { placeholder: "Brand Name" }),
        field("gtin", "GTIN/UPC/EAN", "text", "optional", { placeholder: "0123456789012", helpText: "Global Trade Item Number" }),
        field("mpn", "MPN", "text", "optional", { placeholder: "MPN-123", helpText: "Manufacturer Part Number" }),
        field("price", "Price", "number", "required", { placeholder: "29.99", group: "offers" }),
        field("priceCurrency", "Currency", "select", "required", { options: CURRENCY_OPTIONS, group: "offers" }),
        field("availability", "Availability", "select", "required", { options: AVAILABILITY_OPTIONS, group: "offers" }),
        field("priceValidUntil", "Price Valid Until", "date", "optional", { group: "offers" }),
        field("ratingValue", "Rating Value", "number", "recommended", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "120", group: "rating" }),
        field("bestRating", "Best Rating", "number", "optional", { placeholder: "5", group: "rating" }),
        field("reviewCount", "Review Count", "number", "optional", { placeholder: "85", group: "rating" }),
    ],

    FAQPage: [
        field("faqItems", "FAQ Items", "faq-list", "required", { helpText: "Add question and answer pairs", googleRequirement: "At least 1 question required" }),
    ],

    HowTo: [
        field("name", "Title", "text", "required", { placeholder: "How to do something" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "A description of the how-to guide" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/howto.jpg" }),
        field("totalTime", "Total Time (ISO 8601)", "text", "recommended", { placeholder: "PT30M", helpText: "e.g. PT30M = 30 minutes, PT1H = 1 hour" }),
        field("estimatedCost", "Estimated Cost", "text", "optional", { placeholder: "50 USD" }),
        field("supply", "Supplies Needed", "string-list", "optional", { helpText: "List of supplies needed" }),
        field("tool", "Tools Needed", "string-list", "optional", { helpText: "List of tools needed" }),
        field("steps", "Steps", "step-list", "required", { helpText: "Add step-by-step instructions", googleRequirement: "At least 2 steps required" }),
    ],

    LocalBusiness: [
        field("name", "Business Name", "text", "required", { placeholder: "Business Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Brief description of the business" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/business.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("priceRange", "Price Range", "text", "recommended", { placeholder: "$$", helpText: "e.g. $, $$, $$$, or $10-$50" }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
        field("latitude", "Latitude", "text", "recommended", { placeholder: "37.7749", group: "geo" }),
        field("longitude", "Longitude", "text", "recommended", { placeholder: "-122.4194", group: "geo" }),
        field("openingHours", "Opening Hours", "opening-hours", "recommended", { group: "hours" }),
    ],

    Restaurant: [
        field("name", "Restaurant Name", "text", "required", { placeholder: "Restaurant Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Description of the restaurant" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/restaurant.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("servesCuisine", "Cuisine Type", "text", "recommended", { placeholder: "Italian, Mexican, etc." }),
        field("priceRange", "Price Range", "text", "recommended", { placeholder: "$$" }),
        field("menuUrl", "Menu URL", "url", "optional", { placeholder: "https://example.com/menu" }),
        field("acceptsReservations", "Accepts Reservations", "select", "optional", { options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
        field("latitude", "Latitude", "text", "recommended", { placeholder: "37.7749", group: "geo" }),
        field("longitude", "Longitude", "text", "recommended", { placeholder: "-122.4194", group: "geo" }),
        field("openingHours", "Opening Hours", "opening-hours", "recommended", { group: "hours" }),
        field("ratingValue", "Rating Value", "number", "optional", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "200", group: "rating" }),
    ],

    MedicalBusiness: [
        field("name", "Practice Name", "text", "required", { placeholder: "Medical Practice Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Description of the medical practice" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/practice.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("medicalSpecialty", "Medical Specialty", "text", "recommended", { placeholder: "Cardiology, Dermatology, etc." }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
        field("openingHours", "Opening Hours", "opening-hours", "recommended", { group: "hours" }),
    ],

    LegalService: [
        field("name", "Firm Name", "text", "required", { placeholder: "Law Firm Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Description of legal services" }),
        field("image", "Image URL", "url", "optional", { placeholder: "https://example.com/firm.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("priceRange", "Price Range", "text", "optional", { placeholder: "$$$" }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
        field("openingHours", "Opening Hours", "opening-hours", "optional", { group: "hours" }),
    ],

    FinancialService: [
        field("name", "Service Name", "text", "required", { placeholder: "Financial Service Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Description of financial services" }),
        field("image", "Image URL", "url", "optional", { placeholder: "https://example.com/service.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
        field("openingHours", "Opening Hours", "opening-hours", "optional", { group: "hours" }),
    ],

    RealEstateAgent: [
        field("name", "Agent/Agency Name", "text", "required", { placeholder: "Real Estate Agent Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Description of services" }),
        field("image", "Image URL", "url", "optional", { placeholder: "https://example.com/agent.jpg" }),
        field("telephone", "Phone Number", "text", "recommended", { placeholder: "+1-555-123-4567" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("streetAddress", "Street Address", "text", "required", { placeholder: "123 Main St", group: "address" }),
        field("addressLocality", "City", "text", "required", { placeholder: "San Francisco", group: "address" }),
        field("addressRegion", "State/Region", "text", "required", { placeholder: "CA", group: "address" }),
        field("postalCode", "Postal Code", "text", "required", { placeholder: "94102", group: "address" }),
        field("addressCountry", "Country", "text", "required", { placeholder: "US", group: "address" }),
    ],

    Organization: [
        field("name", "Organization Name", "text", "required", { placeholder: "Organization Name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Brief description" }),
        field("url", "Website URL", "url", "required", { placeholder: "https://example.com" }),
        field("logo", "Logo URL", "url", "required", { placeholder: "https://example.com/logo.png" }),
        field("email", "Email", "text", "optional", { placeholder: "info@example.com" }),
        field("telephone", "Phone", "text", "optional", { placeholder: "+1-555-123-4567" }),
        field("foundingDate", "Founding Date", "date", "optional"),
        field("contactType", "Contact Type", "text", "optional", { placeholder: "customer service", group: "contact" }),
        field("contactTelephone", "Contact Phone", "text", "optional", { placeholder: "+1-555-123-4567", group: "contact" }),
        field("sameAs", "Social Profiles", "string-list", "recommended", { helpText: "URLs of social media profiles" }),
    ],

    Person: [
        field("name", "Full Name", "text", "required", { placeholder: "John Doe" }),
        field("jobTitle", "Job Title", "text", "recommended", { placeholder: "Software Engineer" }),
        field("description", "Description", "textarea", "optional", { placeholder: "Brief bio" }),
        field("url", "Website URL", "url", "recommended", { placeholder: "https://example.com" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/photo.jpg" }),
        field("email", "Email", "text", "optional", { placeholder: "john@example.com" }),
        field("telephone", "Phone", "text", "optional", { placeholder: "+1-555-123-4567" }),
        field("worksForName", "Works For (Organization)", "text", "optional", { placeholder: "Company Name" }),
        field("worksForUrl", "Works For URL", "url", "optional", { placeholder: "https://company.com" }),
        field("sameAs", "Social Profiles", "string-list", "recommended", { helpText: "URLs of social media profiles" }),
    ],

    Event: [
        field("name", "Event Name", "text", "required", { placeholder: "Event name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Event description" }),
        field("image", "Image URL", "url", "recommended", { placeholder: "https://example.com/event.jpg" }),
        field("startDate", "Start Date", "datetime", "required", { googleRequirement: "Required for Event rich results" }),
        field("endDate", "End Date", "datetime", "recommended"),
        field("eventAttendanceMode", "Attendance Mode", "select", "recommended", { options: EVENT_ATTENDANCE_OPTIONS }),
        field("eventStatus", "Event Status", "select", "recommended", { options: EVENT_STATUS_OPTIONS }),
        field("locationName", "Venue Name", "text", "recommended", { placeholder: "Convention Center", group: "location" }),
        field("locationAddress", "Venue Address", "text", "optional", { placeholder: "123 Main St, City, State", group: "location" }),
        field("locationUrl", "Online Event URL", "url", "optional", { placeholder: "https://zoom.us/...", group: "location" }),
        field("performerName", "Performer Name", "text", "optional", { placeholder: "Band Name or Speaker" }),
        field("organizerName", "Organizer Name", "text", "recommended", { placeholder: "Organizer" }),
        field("organizerUrl", "Organizer URL", "url", "optional", { placeholder: "https://organizer.com" }),
        field("offerPrice", "Ticket Price", "number", "optional", { placeholder: "50", group: "offers" }),
        field("offerCurrency", "Currency", "select", "optional", { options: CURRENCY_OPTIONS, group: "offers" }),
        field("offerAvailability", "Availability", "select", "optional", { options: AVAILABILITY_OPTIONS, group: "offers" }),
        field("offerUrl", "Ticket URL", "url", "optional", { placeholder: "https://tickets.example.com", group: "offers" }),
    ],

    Recipe: [
        field("name", "Recipe Name", "text", "required", { placeholder: "Recipe name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Recipe description" }),
        field("image", "Image URL", "url", "required", { placeholder: "https://example.com/recipe.jpg" }),
        field("authorName", "Author", "text", "recommended", { placeholder: "Chef Name" }),
        field("prepTime", "Prep Time (ISO 8601)", "text", "recommended", { placeholder: "PT15M", helpText: "e.g. PT15M = 15 minutes" }),
        field("cookTime", "Cook Time (ISO 8601)", "text", "recommended", { placeholder: "PT30M" }),
        field("totalTime", "Total Time (ISO 8601)", "text", "optional", { placeholder: "PT45M" }),
        field("recipeYield", "Yield / Servings", "text", "recommended", { placeholder: "4 servings" }),
        field("recipeCategory", "Category", "text", "optional", { placeholder: "Dinner" }),
        field("recipeCuisine", "Cuisine", "text", "optional", { placeholder: "Italian" }),
        field("calories", "Calories", "text", "optional", { placeholder: "350 calories" }),
        field("fatContent", "Fat", "text", "optional", { placeholder: "12 g", group: "nutrition" }),
        field("carbohydrateContent", "Carbohydrates", "text", "optional", { placeholder: "45 g", group: "nutrition" }),
        field("proteinContent", "Protein", "text", "optional", { placeholder: "8 g", group: "nutrition" }),
        field("fiberContent", "Fiber", "text", "optional", { placeholder: "3 g", group: "nutrition" }),
        field("sodiumContent", "Sodium", "text", "optional", { placeholder: "200 mg", group: "nutrition" }),
        field("recipeIngredient", "Ingredients", "string-list", "required", { helpText: "One ingredient per line" }),
        field("recipeInstructions", "Instructions", "step-list", "required", { helpText: "Step-by-step instructions" }),
        field("ratingValue", "Rating Value", "number", "optional", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "50", group: "rating" }),
    ],

    Review: [
        field("itemReviewedName", "Item Reviewed", "text", "required", { placeholder: "Product or service name" }),
        field("itemReviewedType", "Item Type", "select", "optional", { options: [
            { value: "Product", label: "Product" },
            { value: "LocalBusiness", label: "Local Business" },
            { value: "Movie", label: "Movie" },
            { value: "Book", label: "Book" },
            { value: "Restaurant", label: "Restaurant" },
            { value: "SoftwareApplication", label: "Software" },
            { value: "CreativeWork", label: "Creative Work" },
            { value: "Course", label: "Course" },
            { value: "Event", label: "Event" },
        ] }),
        field("authorName", "Reviewer Name", "text", "required", { placeholder: "John Doe" }),
        field("authorUrl", "Reviewer URL", "url", "optional", { placeholder: "https://example.com/author" }),
        field("ratingValue", "Rating Value", "number", "required", { placeholder: "4", group: "rating" }),
        field("bestRating", "Best Rating", "number", "optional", { placeholder: "5", group: "rating" }),
        field("worstRating", "Worst Rating", "number", "optional", { placeholder: "1", group: "rating" }),
        field("reviewBody", "Review Body", "textarea", "required", { placeholder: "Write the full review text here..." }),
        field("datePublished", "Date Published", "date", "recommended"),
        field("publisher", "Publisher Name", "text", "optional", { placeholder: "Review Site Name" }),
    ],

    BreadcrumbList: [
        field("breadcrumbs", "Breadcrumb Items", "breadcrumb-list", "required", { helpText: "Ordered list of pages in the breadcrumb trail" }),
    ],

    VideoObject: [
        field("name", "Video Title", "text", "required", { placeholder: "Video title" }),
        field("description", "Description", "textarea", "required", { placeholder: "Video description" }),
        field("thumbnailUrl", "Thumbnail URL", "url", "required", { placeholder: "https://example.com/thumb.jpg" }),
        field("uploadDate", "Upload Date", "date", "required"),
        field("duration", "Duration (ISO 8601)", "text", "recommended", { placeholder: "PT5M30S", helpText: "e.g. PT5M30S = 5 min 30 sec" }),
        field("contentUrl", "Content URL", "url", "recommended", { placeholder: "https://example.com/video.mp4" }),
        field("embedUrl", "Embed URL", "url", "recommended", { placeholder: "https://youtube.com/embed/..." }),
        field("interactionCount", "View Count", "number", "optional", { placeholder: "1500000" }),
    ],

    SoftwareApplication: [
        field("name", "App Name", "text", "required", { placeholder: "App name" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "App description" }),
        field("image", "Image/Icon URL", "url", "recommended", { placeholder: "https://example.com/icon.png" }),
        field("operatingSystem", "Operating System", "text", "recommended", { placeholder: "Windows, macOS, Android, iOS" }),
        field("applicationCategory", "Category", "select", "recommended", { options: SOFTWARE_CATEGORY_OPTIONS }),
        field("price", "Price", "number", "recommended", { placeholder: "0", group: "offers" }),
        field("priceCurrency", "Currency", "select", "optional", { options: CURRENCY_OPTIONS, group: "offers" }),
        field("ratingValue", "Rating Value", "number", "recommended", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "200", group: "rating" }),
        field("bestRating", "Best Rating", "number", "optional", { placeholder: "5", group: "rating" }),
        field("downloadUrl", "Download URL", "url", "optional", { placeholder: "https://example.com/download" }),
        field("softwareVersion", "Version", "text", "optional", { placeholder: "1.0.0" }),
    ],

    Course: [
        field("name", "Course Name", "text", "required", { placeholder: "Introduction to Web Development" }),
        field("description", "Description", "textarea", "required", { placeholder: "Course description" }),
        field("providerName", "Provider Name", "text", "required", { placeholder: "University Name or Platform" }),
        field("providerUrl", "Provider URL", "url", "optional", { placeholder: "https://example.com" }),
        field("url", "Course URL", "url", "recommended", { placeholder: "https://example.com/course" }),
        field("image", "Image URL", "url", "optional", { placeholder: "https://example.com/course.jpg" }),
        field("instructorName", "Instructor Name", "text", "optional", { placeholder: "Professor Name" }),
        field("courseLanguage", "Language", "text", "optional", { placeholder: "English" }),
        field("courseMode", "Mode", "select", "optional", { options: [
            { value: "online", label: "Online" },
            { value: "onsite", label: "On-site" },
            { value: "blended", label: "Blended" },
        ]}),
        field("price", "Price", "number", "optional", { placeholder: "99.99", group: "offers" }),
        field("priceCurrency", "Currency", "select", "optional", { options: CURRENCY_OPTIONS, group: "offers" }),
        field("ratingValue", "Rating Value", "number", "optional", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "200", group: "rating" }),
    ],

    JobPosting: [
        field("title", "Job Title", "text", "required", { placeholder: "Senior Software Engineer", googleRequirement: "Required for Job Posting rich results" }),
        field("description", "Description", "textarea", "required", { placeholder: "Full job description with responsibilities and qualifications" }),
        field("datePosted", "Date Posted", "date", "required"),
        field("validThrough", "Valid Through", "date", "recommended", { helpText: "Application deadline" }),
        field("hiringOrganizationName", "Company Name", "text", "required", { placeholder: "Company Name" }),
        field("hiringOrganizationUrl", "Company Website", "url", "optional", { placeholder: "https://company.com" }),
        field("hiringOrganizationLogo", "Company Logo URL", "url", "optional", { placeholder: "https://company.com/logo.png" }),
        field("employmentType", "Employment Type", "select", "recommended", { options: EMPLOYMENT_TYPE_OPTIONS }),
        field("remote", "Remote Work", "select", "recommended", { options: [
            { value: "true", label: "Fully Remote" },
            { value: "false", label: "On-site" },
            { value: "hybrid", label: "Hybrid" },
        ]}),
        field("streetAddress", "Street Address", "text", "optional", { placeholder: "123 Main St", group: "location" }),
        field("addressLocality", "City", "text", "recommended", { placeholder: "San Francisco", group: "location" }),
        field("addressRegion", "State/Region", "text", "optional", { placeholder: "CA", group: "location" }),
        field("postalCode", "Postal Code", "text", "optional", { placeholder: "94102", group: "location" }),
        field("addressCountry", "Country", "text", "recommended", { placeholder: "US", group: "location" }),
        field("salaryValue", "Salary", "number", "recommended", { placeholder: "120000", group: "salary" }),
        field("salaryMinValue", "Min Salary", "number", "optional", { placeholder: "100000", group: "salary" }),
        field("salaryMaxValue", "Max Salary", "number", "optional", { placeholder: "150000", group: "salary" }),
        field("salaryCurrency", "Currency", "select", "optional", { options: CURRENCY_OPTIONS, group: "salary" }),
        field("salaryUnit", "Pay Period", "select", "optional", { options: [
            { value: "YEAR", label: "Year" },
            { value: "MONTH", label: "Month" },
            { value: "WEEK", label: "Week" },
            { value: "HOUR", label: "Hour" },
        ], group: "salary" }),
        field("experienceRequirements", "Experience Required", "text", "optional", { placeholder: "5+ years of experience in..." }),
        field("educationRequirements", "Education Required", "text", "optional", { placeholder: "Bachelor's degree in Computer Science" }),
        field("skills", "Required Skills", "string-list", "optional", { helpText: "List of required skills" }),
    ],

    Book: [
        field("name", "Book Title", "text", "required", { placeholder: "Book Title" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Book description or synopsis" }),
        field("image", "Cover Image URL", "url", "recommended", { placeholder: "https://example.com/cover.jpg" }),
        field("authorName", "Author Name", "text", "required", { placeholder: "Author Name" }),
        field("authorUrl", "Author URL", "url", "optional", { placeholder: "https://example.com/author" }),
        field("isbn", "ISBN", "text", "recommended", { placeholder: "978-3-16-148410-0" }),
        field("numberOfPages", "Number of Pages", "number", "optional", { placeholder: "350" }),
        field("bookFormat", "Format", "select", "optional", { options: BOOK_FORMAT_OPTIONS }),
        field("publisher", "Publisher", "text", "optional", { placeholder: "Publisher Name" }),
        field("datePublished", "Date Published", "date", "optional"),
        field("inLanguage", "Language", "text", "optional", { placeholder: "en" }),
        field("genre", "Genre", "text", "optional", { placeholder: "Fiction, Mystery, etc." }),
        field("ratingValue", "Rating Value", "number", "optional", { placeholder: "4.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "500", group: "rating" }),
    ],

    Movie: [
        field("name", "Movie Title", "text", "required", { placeholder: "Movie Title" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Movie plot summary" }),
        field("image", "Poster URL", "url", "recommended", { placeholder: "https://example.com/poster.jpg" }),
        field("directorName", "Director", "text", "recommended", { placeholder: "Director Name" }),
        field("actorNames", "Cast", "string-list", "optional", { helpText: "Actor names" }),
        field("dateCreated", "Release Date", "date", "optional"),
        field("duration", "Duration (ISO 8601)", "text", "optional", { placeholder: "PT2H15M", helpText: "e.g. PT2H15M = 2 hours 15 min" }),
        field("genre", "Genre", "text", "optional", { placeholder: "Action, Comedy, Drama" }),
        field("contentRating", "Content Rating", "text", "optional", { placeholder: "PG-13" }),
        field("ratingValue", "Rating Value", "number", "optional", { placeholder: "8.5", group: "rating" }),
        field("ratingCount", "Rating Count", "number", "optional", { placeholder: "50000", group: "rating" }),
        field("bestRating", "Best Rating", "number", "optional", { placeholder: "10", group: "rating" }),
    ],

    MusicAlbum: [
        field("name", "Album Name", "text", "required", { placeholder: "Album Title" }),
        field("description", "Description", "textarea", "optional", { placeholder: "Album description" }),
        field("image", "Cover Art URL", "url", "recommended", { placeholder: "https://example.com/album.jpg" }),
        field("byArtist", "Artist Name", "text", "required", { placeholder: "Artist or Band Name" }),
        field("datePublished", "Release Date", "date", "optional"),
        field("genre", "Genre", "text", "optional", { placeholder: "Rock, Pop, Jazz" }),
        field("numTracks", "Number of Tracks", "number", "optional", { placeholder: "12" }),
        field("trackNames", "Track List", "string-list", "optional", { helpText: "Song titles in order" }),
        field("albumProductionType", "Production Type", "select", "optional", { options: [
            { value: "https://schema.org/StudioAlbum", label: "Studio Album" },
            { value: "https://schema.org/LiveAlbum", label: "Live Album" },
            { value: "https://schema.org/CompilationAlbum", label: "Compilation" },
            { value: "https://schema.org/RemixAlbum", label: "Remix Album" },
        ] }),
    ],

    Dataset: [
        field("name", "Dataset Name", "text", "required", { placeholder: "Dataset Name", googleRequirement: "Required for Dataset rich results" }),
        field("description", "Description", "textarea", "required", { placeholder: "Detailed description of the dataset" }),
        field("url", "Dataset URL", "url", "recommended", { placeholder: "https://example.com/dataset" }),
        field("creatorName", "Creator/Author", "text", "recommended", { placeholder: "Organization or Person Name" }),
        field("creatorUrl", "Creator URL", "url", "optional", { placeholder: "https://example.com" }),
        field("datePublished", "Date Published", "date", "optional"),
        field("dateModified", "Date Modified", "date", "optional"),
        field("license", "License URL", "url", "optional", { placeholder: "https://creativecommons.org/licenses/by/4.0/" }),
        field("distributionUrl", "Download URL", "url", "optional", { placeholder: "https://example.com/data.csv", group: "distribution" }),
        field("distributionFormat", "File Format", "text", "optional", { placeholder: "text/csv", group: "distribution" }),
        field("distributionSize", "File Size", "text", "optional", { placeholder: "2.5 MB", group: "distribution" }),
        field("keywords", "Keywords", "string-list", "optional", { helpText: "Keywords describing the dataset" }),
    ],

    ItemList: [
        field("name", "List Name", "text", "optional", { placeholder: "Top 10 Best Products" }),
        field("description", "Description", "textarea", "optional", { placeholder: "Description of this list" }),
        field("itemListOrder", "List Order", "select", "optional", { options: [
            { value: "https://schema.org/ItemListOrderAscending", label: "Ascending" },
            { value: "https://schema.org/ItemListOrderDescending", label: "Descending" },
            { value: "https://schema.org/ItemListUnordered", label: "Unordered" },
        ] }),
        field("listItems", "List Items", "item-list", "required", { helpText: "Items in the list with name, URL, and optional position" }),
    ],

    WebSite: [
        field("name", "Website Name", "text", "required", { placeholder: "My Website", googleRequirement: "Required for sitelinks search box" }),
        field("url", "Website URL", "url", "required", { placeholder: "https://example.com" }),
        field("description", "Description", "textarea", "optional", { placeholder: "Website description" }),
        field("searchActionTarget", "Search URL Template", "text", "recommended", {
            placeholder: "https://example.com/search?q={search_term_string}",
            helpText: "URL template for site search. Use {search_term_string} as the query placeholder.",
            googleRequirement: "Required for sitelinks search box",
        }),
        field("searchActionQueryInput", "Query Input Name", "text", "optional", {
            placeholder: "search_term_string",
            helpText: "Name of the query parameter (must match template placeholder)",
        }),
        field("alternativeName", "Alternative Name", "text", "optional", { placeholder: "Short name or acronym" }),
        field("inLanguage", "Language", "text", "optional", { placeholder: "en" }),
    ],

    PodcastEpisode: [
        field("name", "Episode Title", "text", "required", { placeholder: "Episode Title" }),
        field("description", "Description", "textarea", "recommended", { placeholder: "Episode description" }),
        field("url", "Episode URL", "url", "recommended", { placeholder: "https://example.com/episode-1" }),
        field("datePublished", "Date Published", "date", "recommended"),
        field("duration", "Duration (ISO 8601)", "text", "optional", { placeholder: "PT45M", helpText: "e.g. PT45M = 45 minutes" }),
        field("image", "Episode Image URL", "url", "optional", { placeholder: "https://example.com/episode.jpg" }),
        field("contentUrl", "Audio File URL", "url", "optional", { placeholder: "https://example.com/episode.mp3" }),
        field("seriesName", "Podcast Series Name", "text", "recommended", { placeholder: "My Podcast", group: "series" }),
        field("seriesUrl", "Podcast Series URL", "url", "optional", { placeholder: "https://example.com/podcast", group: "series" }),
        field("seriesImage", "Podcast Series Image", "url", "optional", { placeholder: "https://example.com/podcast-art.jpg", group: "series" }),
        field("episodeNumber", "Episode Number", "number", "optional", { placeholder: "42" }),
        field("seasonNumber", "Season Number", "number", "optional", { placeholder: "2" }),
    ],
}
