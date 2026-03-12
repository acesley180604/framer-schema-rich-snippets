import type { SchemaType } from "./types"

export interface SchemaTemplate {
    id: string
    name: string
    description: string
    category: string
    type: SchemaType
    data: Record<string, unknown>
}

export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
    // ── Article Templates ───────────────────────────────────────────────────
    {
        id: "blog-post",
        name: "Blog Post",
        description: "Standard blog post article schema with author and publisher info",
        category: "Content",
        type: "Article",
        data: {
            headline: "My Blog Post Title",
            description: "A brief summary of the blog post content.",
            image: "https://example.com/blog-image.jpg",
            authorName: "Author Name",
            authorUrl: "https://example.com/author",
            datePublished: new Date().toISOString().split("T")[0],
            dateModified: new Date().toISOString().split("T")[0],
            publisherName: "My Website",
            publisherLogo: "https://example.com/logo.png",
            articleSection: "Blog",
        },
    },
    {
        id: "news-article",
        name: "News Article",
        description: "News article schema for press and media content",
        category: "Content",
        type: "Article",
        data: {
            headline: "Breaking News Headline",
            description: "Summary of the news article.",
            image: "https://example.com/news-image.jpg",
            authorName: "Reporter Name",
            authorUrl: "https://example.com/reporter",
            datePublished: new Date().toISOString().split("T")[0],
            publisherName: "News Organization",
            publisherLogo: "https://example.com/news-logo.png",
            articleSection: "News",
        },
    },

    // ── Product Templates ───────────────────────────────────────────────────
    {
        id: "ecommerce-product",
        name: "E-Commerce Product",
        description: "Product listing with price, availability, and reviews",
        category: "Commerce",
        type: "Product",
        data: {
            name: "Product Name",
            description: "Detailed product description with key features.",
            image: "https://example.com/product.jpg",
            sku: "SKU-001",
            brand: "Brand Name",
            price: "49.99",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            ratingValue: "4.5",
            ratingCount: "120",
            bestRating: "5",
            reviewCount: "85",
        },
    },
    {
        id: "saas-product",
        name: "SaaS Product",
        description: "Software-as-a-Service product with subscription pricing",
        category: "Commerce",
        type: "SoftwareApplication",
        data: {
            name: "App Name",
            description: "A powerful SaaS tool that helps you accomplish tasks faster.",
            image: "https://example.com/app-icon.png",
            operatingSystem: "Web, Windows, macOS",
            applicationCategory: "BusinessApplication",
            price: "29",
            priceCurrency: "USD",
            ratingValue: "4.7",
            ratingCount: "500",
            bestRating: "5",
        },
    },

    // ── FAQ Templates ───────────────────────────────────────────────────────
    {
        id: "support-faq",
        name: "Support FAQ",
        description: "Frequently asked questions for a support or help page",
        category: "Content",
        type: "FAQPage",
        data: {
            faqItems: [
                { question: "How do I get started?", answer: "Sign up for a free account and follow our quick-start guide." },
                { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, and PayPal." },
                { question: "Can I cancel my subscription?", answer: "Yes, you can cancel anytime from your account settings." },
            ],
        },
    },

    // ── Local Business Templates ────────────────────────────────────────────
    {
        id: "restaurant",
        name: "Restaurant",
        description: "Restaurant listing with address, hours, and price range",
        category: "Local",
        type: "LocalBusiness",
        data: {
            name: "Restaurant Name",
            description: "A cozy restaurant serving authentic cuisine.",
            telephone: "+1-555-123-4567",
            url: "https://example.com",
            priceRange: "$$",
            streetAddress: "123 Main Street",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            postalCode: "94102",
            addressCountry: "US",
            latitude: "37.7749",
            longitude: "-122.4194",
            openingHours: [
                { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "11:00", closes: "22:00" },
                { dayOfWeek: ["Saturday", "Sunday"], opens: "10:00", closes: "23:00" },
            ],
        },
    },
    {
        id: "local-service",
        name: "Local Service Business",
        description: "Service business like plumber, electrician, or salon",
        category: "Local",
        type: "LocalBusiness",
        data: {
            name: "Service Business Name",
            description: "Professional service provider in your area.",
            telephone: "+1-555-987-6543",
            url: "https://example.com",
            priceRange: "$$$",
            streetAddress: "456 Oak Avenue",
            addressLocality: "Los Angeles",
            addressRegion: "CA",
            postalCode: "90001",
            addressCountry: "US",
        },
    },

    // ── Organization Templates ──────────────────────────────────────────────
    {
        id: "company",
        name: "Company / Startup",
        description: "Organization schema with logo, contact, and social profiles",
        category: "Business",
        type: "Organization",
        data: {
            name: "Company Name",
            description: "We build innovative solutions for modern businesses.",
            url: "https://example.com",
            logo: "https://example.com/logo.png",
            email: "hello@example.com",
            telephone: "+1-555-000-0000",
            contactType: "customer service",
            contactTelephone: "+1-555-000-0000",
            sameAs: [
                "https://twitter.com/company",
                "https://linkedin.com/company/company",
                "https://facebook.com/company",
            ],
        },
    },

    // ── Event Templates ─────────────────────────────────────────────────────
    {
        id: "conference",
        name: "Conference / Workshop",
        description: "Event schema for conferences, workshops, and meetups",
        category: "Events",
        type: "Event",
        data: {
            name: "Annual Tech Conference 2025",
            description: "Join us for the biggest tech event of the year.",
            image: "https://example.com/event.jpg",
            startDate: "2025-06-15T09:00",
            endDate: "2025-06-17T18:00",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            locationName: "Convention Center",
            locationAddress: "789 Event Blvd, San Francisco, CA",
            organizerName: "Tech Events Inc.",
            organizerUrl: "https://techevents.com",
            offerPrice: "299",
            offerCurrency: "USD",
            offerAvailability: "https://schema.org/InStock",
            offerUrl: "https://example.com/tickets",
        },
    },
    {
        id: "webinar",
        name: "Webinar / Online Event",
        description: "Online event schema for webinars and virtual meetups",
        category: "Events",
        type: "Event",
        data: {
            name: "Free Product Demo Webinar",
            description: "Join our live demo to see the product in action.",
            startDate: "2025-04-10T14:00",
            endDate: "2025-04-10T15:00",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            locationUrl: "https://zoom.us/j/123456789",
            organizerName: "Company Name",
            offerPrice: "0",
            offerCurrency: "USD",
            offerAvailability: "https://schema.org/InStock",
        },
    },

    // ── Recipe Templates ────────────────────────────────────────────────────
    {
        id: "recipe-basic",
        name: "Basic Recipe",
        description: "Recipe with ingredients, instructions, and nutrition info",
        category: "Content",
        type: "Recipe",
        data: {
            name: "Classic Chocolate Chip Cookies",
            description: "Soft and chewy chocolate chip cookies made from scratch.",
            image: "https://example.com/cookies.jpg",
            authorName: "Chef Name",
            prepTime: "PT15M",
            cookTime: "PT12M",
            totalTime: "PT27M",
            recipeYield: "24 cookies",
            recipeCategory: "Dessert",
            recipeCuisine: "American",
            calories: "150 calories",
            recipeIngredient: [
                "2 1/4 cups all-purpose flour",
                "1 tsp baking soda",
                "1 tsp salt",
                "1 cup butter, softened",
                "3/4 cup sugar",
                "3/4 cup brown sugar",
                "2 large eggs",
                "2 tsp vanilla extract",
                "2 cups chocolate chips",
            ],
            recipeInstructions: [
                { name: "Mix dry ingredients", text: "Combine flour, baking soda, and salt in a bowl." },
                { name: "Cream butter and sugar", text: "Beat butter and sugars until light and fluffy." },
                { name: "Add eggs", text: "Beat in eggs and vanilla extract." },
                { name: "Combine", text: "Gradually mix in the dry ingredients. Fold in chocolate chips." },
                { name: "Bake", text: "Drop rounded tablespoons onto baking sheets. Bake at 375F for 9-11 minutes." },
            ],
        },
    },

    // ── Video Templates ─────────────────────────────────────────────────────
    {
        id: "youtube-video",
        name: "YouTube Video",
        description: "Video schema for YouTube or embedded video content",
        category: "Content",
        type: "VideoObject",
        data: {
            name: "Video Title",
            description: "A detailed description of the video content.",
            thumbnailUrl: "https://example.com/thumbnail.jpg",
            uploadDate: new Date().toISOString().split("T")[0],
            duration: "PT10M30S",
            embedUrl: "https://www.youtube.com/embed/VIDEO_ID",
        },
    },

    // ── HowTo Templates ────────────────────────────────────────────────────
    {
        id: "tutorial",
        name: "Tutorial / Guide",
        description: "Step-by-step how-to guide with tools and supplies",
        category: "Content",
        type: "HowTo",
        data: {
            name: "How to Set Up Your New Website",
            description: "A complete guide to setting up a website from scratch.",
            image: "https://example.com/tutorial.jpg",
            totalTime: "PT1H",
            estimatedCost: "50 USD",
            supply: ["Domain name", "Hosting plan"],
            tool: ["Web browser", "Text editor"],
            steps: [
                { name: "Choose a domain", text: "Pick a domain name that represents your brand." },
                { name: "Select hosting", text: "Choose a reliable hosting provider." },
                { name: "Install CMS", text: "Set up your content management system." },
                { name: "Design your site", text: "Customize your theme and add content." },
                { name: "Launch", text: "Review everything and publish your site." },
            ],
        },
    },

    // ── Breadcrumb Templates ────────────────────────────────────────────────
    {
        id: "breadcrumb-ecommerce",
        name: "E-Commerce Breadcrumb",
        description: "Product category breadcrumb trail for e-commerce sites",
        category: "Navigation",
        type: "BreadcrumbList",
        data: {
            breadcrumbs: [
                { name: "Home", url: "https://example.com" },
                { name: "Electronics", url: "https://example.com/electronics" },
                { name: "Phones", url: "https://example.com/electronics/phones" },
                { name: "iPhone 15", url: "https://example.com/electronics/phones/iphone-15" },
            ],
        },
    },

    // ── Person Templates ────────────────────────────────────────────────────
    {
        id: "personal-profile",
        name: "Personal Profile",
        description: "Person schema for about pages and author profiles",
        category: "People",
        type: "Person",
        data: {
            name: "John Doe",
            jobTitle: "Senior Software Engineer",
            description: "Experienced developer specializing in web technologies.",
            url: "https://johndoe.com",
            image: "https://johndoe.com/photo.jpg",
            email: "john@example.com",
            worksForName: "Tech Company",
            worksForUrl: "https://techcompany.com",
            sameAs: [
                "https://twitter.com/johndoe",
                "https://linkedin.com/in/johndoe",
                "https://github.com/johndoe",
            ],
        },
    },

    // ── Review Templates ────────────────────────────────────────────────────
    {
        id: "product-review",
        name: "Product Review",
        description: "Individual product review with rating",
        category: "Content",
        type: "Review",
        data: {
            itemReviewedName: "Product Name",
            itemReviewedType: "Product",
            authorName: "Reviewer Name",
            ratingValue: "4",
            bestRating: "5",
            worstRating: "1",
            reviewBody: "This product exceeded my expectations. The quality is outstanding and it works exactly as described.",
            datePublished: new Date().toISOString().split("T")[0],
        },
    },
]

export function getTemplatesByCategory(): Record<string, SchemaTemplate[]> {
    const grouped: Record<string, SchemaTemplate[]> = {}
    for (const template of SCHEMA_TEMPLATES) {
        if (!grouped[template.category]) {
            grouped[template.category] = []
        }
        grouped[template.category].push(template)
    }
    return grouped
}
