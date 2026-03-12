import type { SchemaType, SchemaEntry } from "@/schemas/types"

function buildArticle(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.headline,
        image: data.image ? [data.image] : undefined,
        datePublished: data.datePublished || undefined,
        dateModified: data.dateModified || undefined,
        articleSection: data.articleSection || undefined,
        wordCount: data.wordCount ? Number(data.wordCount) : undefined,
        description: data.description || undefined,
        author: {
            "@type": "Person",
            name: data.authorName,
            url: data.authorUrl || undefined,
        },
        publisher: {
            "@type": "Organization",
            name: data.publisherName,
            logo: data.publisherLogo
                ? { "@type": "ImageObject", url: data.publisherLogo }
                : undefined,
        },
    }
    return schema
}

function buildProduct(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description || undefined,
        image: data.image ? [data.image] : undefined,
        sku: data.sku || undefined,
        brand: data.brand ? { "@type": "Brand", name: data.brand } : undefined,
        offers: {
            "@type": "Offer",
            price: data.price || undefined,
            priceCurrency: data.priceCurrency || undefined,
            availability: data.availability || undefined,
        },
    }
    if (data.ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            ratingCount: data.ratingCount || undefined,
            bestRating: data.bestRating || "5",
            reviewCount: data.reviewCount || undefined,
        }
    }
    return schema
}

function buildFAQPage(data: Record<string, unknown>): Record<string, unknown> {
    const items = (data.faqItems as Array<{ question: string; answer: string }>) || []
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items
            .filter((item) => item.question?.trim() && item.answer?.trim())
            .map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                },
            })),
    }
}

function buildHowTo(data: Record<string, unknown>): Record<string, unknown> {
    const steps = (data.steps as Array<{ name: string; text: string; image?: string }>) || []
    const supply = (data.supply as string[]) || []
    const tool = (data.tool as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        totalTime: data.totalTime || undefined,
        estimatedCost: data.estimatedCost
            ? { "@type": "MonetaryAmount", currency: "USD", value: data.estimatedCost }
            : undefined,
        supply: supply.filter(Boolean).length > 0
            ? supply.filter(Boolean).map((s) => ({ "@type": "HowToSupply", name: s }))
            : undefined,
        tool: tool.filter(Boolean).length > 0
            ? tool.filter(Boolean).map((t) => ({ "@type": "HowToTool", name: t }))
            : undefined,
        step: steps
            .filter((s) => s.text?.trim())
            .map((step, i) => ({
                "@type": "HowToStep",
                name: step.name || `Step ${i + 1}`,
                text: step.text,
                image: step.image || undefined,
            })),
    }
    return schema
}

function buildLocalBusiness(data: Record<string, unknown>): Record<string, unknown> {
    const hours = (data.openingHours as Array<{ dayOfWeek: string[]; opens: string; closes: string }>) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        telephone: data.telephone || undefined,
        url: data.url || undefined,
        priceRange: data.priceRange || undefined,
        address: {
            "@type": "PostalAddress",
            streetAddress: data.streetAddress,
            addressLocality: data.addressLocality,
            addressRegion: data.addressRegion,
            postalCode: data.postalCode,
            addressCountry: data.addressCountry,
        },
    }

    if (data.latitude && data.longitude) {
        schema.geo = {
            "@type": "GeoCoordinates",
            latitude: data.latitude,
            longitude: data.longitude,
        }
    }

    if (hours.length > 0) {
        schema.openingHoursSpecification = hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes,
        }))
    }

    return schema
}

function buildOrganization(data: Record<string, unknown>): Record<string, unknown> {
    const sameAs = (data.sameAs as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: data.name,
        description: data.description || undefined,
        url: data.url,
        logo: data.logo || undefined,
        email: data.email || undefined,
        telephone: data.telephone || undefined,
        foundingDate: data.foundingDate || undefined,
        sameAs: sameAs.filter(Boolean).length > 0 ? sameAs.filter(Boolean) : undefined,
    }

    if (data.contactTelephone || data.contactType) {
        schema.contactPoint = {
            "@type": "ContactPoint",
            telephone: data.contactTelephone || undefined,
            contactType: data.contactType || undefined,
        }
    }

    return schema
}

function buildPerson(data: Record<string, unknown>): Record<string, unknown> {
    const sameAs = (data.sameAs as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.name,
        jobTitle: data.jobTitle || undefined,
        description: data.description || undefined,
        url: data.url || undefined,
        image: data.image || undefined,
        email: data.email || undefined,
        telephone: data.telephone || undefined,
        sameAs: sameAs.filter(Boolean).length > 0 ? sameAs.filter(Boolean) : undefined,
    }

    if (data.worksForName) {
        schema.worksFor = {
            "@type": "Organization",
            name: data.worksForName,
            url: data.worksForUrl || undefined,
        }
    }

    return schema
}

function buildEvent(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        eventAttendanceMode: data.eventAttendanceMode || undefined,
        eventStatus: data.eventStatus || undefined,
    }

    if (data.locationName || data.locationAddress) {
        schema.location = {
            "@type": "Place",
            name: data.locationName || undefined,
            address: data.locationAddress || undefined,
        }
    } else if (data.locationUrl) {
        schema.location = {
            "@type": "VirtualLocation",
            url: data.locationUrl,
        }
    }

    if (data.performerName) {
        schema.performer = {
            "@type": "Person",
            name: data.performerName,
        }
    }

    if (data.organizerName) {
        schema.organizer = {
            "@type": "Organization",
            name: data.organizerName,
            url: data.organizerUrl || undefined,
        }
    }

    if (data.offerPrice) {
        schema.offers = {
            "@type": "Offer",
            price: data.offerPrice,
            priceCurrency: data.offerCurrency || "USD",
            availability: data.offerAvailability || undefined,
            url: data.offerUrl || undefined,
        }
    }

    return schema
}

function buildRecipe(data: Record<string, unknown>): Record<string, unknown> {
    const ingredients = (data.recipeIngredient as string[]) || []
    const instructions = (data.recipeInstructions as Array<{ name: string; text: string }>) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: data.name,
        description: data.description || undefined,
        image: data.image ? [data.image] : undefined,
        author: data.authorName ? { "@type": "Person", name: data.authorName } : undefined,
        prepTime: data.prepTime || undefined,
        cookTime: data.cookTime || undefined,
        totalTime: data.totalTime || undefined,
        recipeYield: data.recipeYield || undefined,
        recipeCategory: data.recipeCategory || undefined,
        recipeCuisine: data.recipeCuisine || undefined,
        recipeIngredient: ingredients.filter(Boolean),
        recipeInstructions: instructions
            .filter((s) => s.text?.trim())
            .map((step) => ({
                "@type": "HowToStep",
                name: step.name || undefined,
                text: step.text,
            })),
    }

    if (data.calories) {
        schema.nutrition = {
            "@type": "NutritionInformation",
            calories: data.calories,
        }
    }

    if (data.ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            ratingCount: data.ratingCount || undefined,
            bestRating: "5",
        }
    }

    return schema
}

function buildReview(data: Record<string, unknown>): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: {
            "@type": (data.itemReviewedType as string) || "Thing",
            name: data.itemReviewedName,
        },
        author: {
            "@type": "Person",
            name: data.authorName,
            url: data.authorUrl || undefined,
        },
        reviewRating: {
            "@type": "Rating",
            ratingValue: data.ratingValue,
            bestRating: data.bestRating || "5",
            worstRating: data.worstRating || "1",
        },
        reviewBody: data.reviewBody || undefined,
        datePublished: data.datePublished || undefined,
        publisher: data.publisher
            ? { "@type": "Organization", name: data.publisher }
            : undefined,
    }
}

function buildBreadcrumbList(data: Record<string, unknown>): Record<string, unknown> {
    const breadcrumbs = (data.breadcrumbs as Array<{ name: string; url: string }>) || []
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs
            .filter((b) => b.name?.trim() && b.url?.trim())
            .map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: b.name,
                item: b.url,
            })),
    }
}

function buildVideoObject(data: Record<string, unknown>): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl ? [data.thumbnailUrl] : undefined,
        uploadDate: data.uploadDate || undefined,
        duration: data.duration || undefined,
        contentUrl: data.contentUrl || undefined,
        embedUrl: data.embedUrl || undefined,
        interactionStatistic: data.interactionCount
            ? {
                  "@type": "InteractionCounter",
                  interactionType: { "@type": "WatchAction" },
                  userInteractionCount: Number(data.interactionCount),
              }
            : undefined,
    }
}

function buildSoftwareApplication(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        operatingSystem: data.operatingSystem || undefined,
        applicationCategory: data.applicationCategory || undefined,
        softwareVersion: data.softwareVersion || undefined,
        downloadUrl: data.downloadUrl || undefined,
    }

    if (data.price !== undefined && data.price !== "") {
        schema.offers = {
            "@type": "Offer",
            price: data.price,
            priceCurrency: data.priceCurrency || "USD",
        }
    }

    if (data.ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            ratingCount: data.ratingCount || undefined,
            bestRating: data.bestRating || "5",
        }
    }

    return schema
}

const BUILDERS: Record<SchemaType, (data: Record<string, unknown>) => Record<string, unknown>> = {
    Article: buildArticle,
    Product: buildProduct,
    FAQPage: buildFAQPage,
    HowTo: buildHowTo,
    LocalBusiness: buildLocalBusiness,
    Organization: buildOrganization,
    Person: buildPerson,
    Event: buildEvent,
    Recipe: buildRecipe,
    Review: buildReview,
    BreadcrumbList: buildBreadcrumbList,
    VideoObject: buildVideoObject,
    SoftwareApplication: buildSoftwareApplication,
}

function removeUndefined(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        return obj.map(removeUndefined)
    }
    if (obj && typeof obj === "object") {
        const cleaned: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            if (value !== undefined && value !== null && value !== "") {
                const cleanedValue = removeUndefined(value)
                if (Array.isArray(cleanedValue) && cleanedValue.length === 0) continue
                cleaned[key] = cleanedValue
            }
        }
        return cleaned
    }
    return obj
}

export function generateJsonLd(entry: SchemaEntry): Record<string, unknown> {
    const builder = BUILDERS[entry.type]
    if (!builder) return {}
    const raw = builder(entry.data)
    return removeUndefined(raw) as Record<string, unknown>
}

export function generateJsonLdString(entry: SchemaEntry): string {
    const jsonld = generateJsonLd(entry)
    return JSON.stringify(jsonld, null, 2)
}

export function generateAllJsonLdString(entries: SchemaEntry[]): string {
    if (entries.length === 0) return ""
    if (entries.length === 1) {
        return generateJsonLdString(entries[0])
    }
    const schemas = entries.map((e) => generateJsonLd(e))
    return JSON.stringify(schemas, null, 2)
}

export function generateScriptTag(entries: SchemaEntry[]): string {
    if (entries.length === 0) return ""
    const json = generateAllJsonLdString(entries)
    return `<script type="application/ld+json">\n${json}\n</script>`
}

export function getGoogleTestUrl(entries: SchemaEntry[]): string {
    const json = generateAllJsonLdString(entries)
    const encoded = encodeURIComponent(json)
    return `https://search.google.com/test/rich-results?code=${encoded}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}
