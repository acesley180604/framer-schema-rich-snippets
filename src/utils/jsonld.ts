import type { SchemaType, SchemaEntry } from "@/schemas/types"

function buildArticle(data: Record<string, unknown>, schemaType: string = "Article"): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": schemaType,
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
    if (schemaType === "NewsArticle" && data.dateline) {
        schema.dateline = data.dateline
    }
    if (schemaType === "BlogPosting" && data.commentCount) {
        schema.commentCount = Number(data.commentCount)
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
        gtin: data.gtin || undefined,
        mpn: data.mpn || undefined,
        brand: data.brand ? { "@type": "Brand", name: data.brand } : undefined,
        offers: {
            "@type": "Offer",
            price: data.price || undefined,
            priceCurrency: data.priceCurrency || undefined,
            availability: data.availability || undefined,
            priceValidUntil: data.priceValidUntil || undefined,
            url: data.offerUrl || undefined,
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

function buildLocalBusiness(data: Record<string, unknown>, subType?: string): Record<string, unknown> {
    const hours = (data.openingHours as Array<{ dayOfWeek: string[]; opens: string; closes: string }>) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": subType || "LocalBusiness",
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

    if (subType === "Restaurant") {
        if (data.servesCuisine) schema.servesCuisine = data.servesCuisine
        if (data.menuUrl) schema.menu = data.menuUrl
        if (data.acceptsReservations) schema.acceptsReservations = data.acceptsReservations === "true"
    }

    if (subType === "MedicalBusiness" && data.medicalSpecialty) {
        schema.medicalSpecialty = data.medicalSpecialty
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

    const nutritionFields: Record<string, string | undefined> = {}
    if (data.calories) nutritionFields.calories = data.calories as string
    if (data.fatContent) nutritionFields.fatContent = data.fatContent as string
    if (data.carbohydrateContent) nutritionFields.carbohydrateContent = data.carbohydrateContent as string
    if (data.proteinContent) nutritionFields.proteinContent = data.proteinContent as string
    if (data.fiberContent) nutritionFields.fiberContent = data.fiberContent as string
    if (data.sodiumContent) nutritionFields.sodiumContent = data.sodiumContent as string

    if (Object.keys(nutritionFields).length > 0) {
        schema.nutrition = {
            "@type": "NutritionInformation",
            ...nutritionFields,
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

function buildCourse(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: data.name,
        description: data.description || undefined,
        url: data.url || undefined,
        image: data.image || undefined,
        inLanguage: data.courseLanguage || undefined,
        courseMode: data.courseMode || undefined,
        provider: {
            "@type": "Organization",
            name: data.providerName,
            url: data.providerUrl || undefined,
        },
    }

    if (data.instructorName) {
        schema.instructor = {
            "@type": "Person",
            name: data.instructorName,
        }
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
        }
    }

    return schema
}

function buildJobPosting(data: Record<string, unknown>): Record<string, unknown> {
    const skills = (data.skills as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: data.title,
        description: data.description || undefined,
        datePosted: data.datePosted || undefined,
        validThrough: data.validThrough || undefined,
        employmentType: data.employmentType || undefined,
        hiringOrganization: {
            "@type": "Organization",
            name: data.hiringOrganizationName,
            sameAs: data.hiringOrganizationUrl || undefined,
            logo: data.hiringOrganizationLogo || undefined,
        },
        experienceRequirements: data.experienceRequirements || undefined,
        educationRequirements: data.educationRequirements
            ? { "@type": "EducationalOccupationalCredential", credentialCategory: data.educationRequirements }
            : undefined,
        skills: skills.filter(Boolean).length > 0 ? skills.filter(Boolean) : undefined,
    }

    if (data.remote === "true") {
        schema.jobLocationType = "TELECOMMUTE"
    }

    if (data.addressLocality || data.streetAddress) {
        schema.jobLocation = {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                streetAddress: data.streetAddress || undefined,
                addressLocality: data.addressLocality || undefined,
                addressRegion: data.addressRegion || undefined,
                postalCode: data.postalCode || undefined,
                addressCountry: data.addressCountry || undefined,
            },
        }
    }

    if (data.salaryValue || data.salaryMinValue) {
        const baseSalary: Record<string, unknown> = {
            "@type": "MonetaryAmount",
            currency: data.salaryCurrency || "USD",
        }

        if (data.salaryMinValue && data.salaryMaxValue) {
            baseSalary.value = {
                "@type": "QuantitativeValue",
                minValue: Number(data.salaryMinValue),
                maxValue: Number(data.salaryMaxValue),
                unitText: data.salaryUnit || "YEAR",
            }
        } else if (data.salaryValue) {
            baseSalary.value = {
                "@type": "QuantitativeValue",
                value: Number(data.salaryValue),
                unitText: data.salaryUnit || "YEAR",
            }
        }

        schema.baseSalary = baseSalary
    }

    return schema
}

function buildBook(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        author: data.authorName
            ? { "@type": "Person", name: data.authorName, url: data.authorUrl || undefined }
            : undefined,
        isbn: data.isbn || undefined,
        numberOfPages: data.numberOfPages ? Number(data.numberOfPages) : undefined,
        bookFormat: data.bookFormat || undefined,
        publisher: data.publisher
            ? { "@type": "Organization", name: data.publisher }
            : undefined,
        datePublished: data.datePublished || undefined,
        inLanguage: data.inLanguage || undefined,
        genre: data.genre || undefined,
    }

    if (data.ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            ratingCount: data.ratingCount || undefined,
        }
    }

    return schema
}

function buildMovie(data: Record<string, unknown>): Record<string, unknown> {
    const actorNames = (data.actorNames as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        director: data.directorName
            ? { "@type": "Person", name: data.directorName }
            : undefined,
        actor: actorNames.filter(Boolean).length > 0
            ? actorNames.filter(Boolean).map((name) => ({ "@type": "Person", name }))
            : undefined,
        dateCreated: data.dateCreated || undefined,
        duration: data.duration || undefined,
        genre: data.genre || undefined,
        contentRating: data.contentRating || undefined,
    }

    if (data.ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            ratingCount: data.ratingCount || undefined,
            bestRating: data.bestRating || "10",
        }
    }

    return schema
}

function buildMusicAlbum(data: Record<string, unknown>): Record<string, unknown> {
    const trackNames = (data.trackNames as string[]) || []

    return {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        byArtist: data.byArtist
            ? { "@type": "MusicGroup", name: data.byArtist }
            : undefined,
        datePublished: data.datePublished || undefined,
        genre: data.genre || undefined,
        numTracks: data.numTracks ? Number(data.numTracks) : undefined,
        albumProductionType: data.albumProductionType || undefined,
        track: trackNames.filter(Boolean).length > 0
            ? trackNames.filter(Boolean).map((name, i) => ({
                  "@type": "MusicRecording",
                  name,
                  position: i + 1,
              }))
            : undefined,
    }
}

function buildDataset(data: Record<string, unknown>): Record<string, unknown> {
    const keywords = (data.keywords as string[]) || []

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: data.name,
        description: data.description || undefined,
        url: data.url || undefined,
        creator: data.creatorName
            ? { "@type": "Organization", name: data.creatorName, url: data.creatorUrl || undefined }
            : undefined,
        datePublished: data.datePublished || undefined,
        dateModified: data.dateModified || undefined,
        license: data.license || undefined,
        keywords: keywords.filter(Boolean).length > 0 ? keywords.filter(Boolean) : undefined,
    }

    if (data.distributionUrl || data.distributionFormat) {
        schema.distribution = {
            "@type": "DataDownload",
            contentUrl: data.distributionUrl || undefined,
            encodingFormat: data.distributionFormat || undefined,
            contentSize: data.distributionSize || undefined,
        }
    }

    return schema
}

function buildItemList(data: Record<string, unknown>): Record<string, unknown> {
    const items = (data.listItems as Array<{ name: string; url: string }>) || []

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: data.name || undefined,
        description: data.description || undefined,
        itemListOrder: data.itemListOrder || undefined,
        numberOfItems: items.length,
        itemListElement: items
            .filter((item) => item.name?.trim())
            .map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.name,
                url: item.url || undefined,
            })),
    }
}

function buildWebSite(data: Record<string, unknown>): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: data.name,
        url: data.url,
        description: data.description || undefined,
        alternateName: data.alternativeName || undefined,
        inLanguage: data.inLanguage || undefined,
    }

    if (data.searchActionTarget) {
        schema.potentialAction = {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: data.searchActionTarget,
            },
            "query-input": `required name=${data.searchActionQueryInput || "search_term_string"}`,
        }
    }

    return schema
}

function buildPodcastEpisode(data: Record<string, unknown>): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        name: data.name,
        description: data.description || undefined,
        url: data.url || undefined,
        datePublished: data.datePublished || undefined,
        duration: data.duration || undefined,
        image: data.image || undefined,
        associatedMedia: data.contentUrl
            ? { "@type": "MediaObject", contentUrl: data.contentUrl }
            : undefined,
        episodeNumber: data.episodeNumber ? Number(data.episodeNumber) : undefined,
        partOfSeason: data.seasonNumber
            ? { "@type": "PodcastSeason", seasonNumber: Number(data.seasonNumber) }
            : undefined,
        partOfSeries: data.seriesName
            ? {
                  "@type": "PodcastSeries",
                  name: data.seriesName,
                  url: data.seriesUrl || undefined,
                  image: data.seriesImage || undefined,
              }
            : undefined,
    }
}

const BUILDERS: Record<SchemaType, (data: Record<string, unknown>) => Record<string, unknown>> = {
    Article: (data) => buildArticle(data, "Article"),
    NewsArticle: (data) => buildArticle(data, "NewsArticle"),
    BlogPosting: (data) => buildArticle(data, "BlogPosting"),
    Product: buildProduct,
    FAQPage: buildFAQPage,
    HowTo: buildHowTo,
    LocalBusiness: (data) => buildLocalBusiness(data),
    Restaurant: (data) => buildLocalBusiness(data, "Restaurant"),
    MedicalBusiness: (data) => buildLocalBusiness(data, "MedicalBusiness"),
    LegalService: (data) => buildLocalBusiness(data, "LegalService"),
    FinancialService: (data) => buildLocalBusiness(data, "FinancialService"),
    RealEstateAgent: (data) => buildLocalBusiness(data, "RealEstateAgent"),
    Organization: buildOrganization,
    Person: buildPerson,
    Event: buildEvent,
    Recipe: buildRecipe,
    Review: buildReview,
    BreadcrumbList: buildBreadcrumbList,
    VideoObject: buildVideoObject,
    SoftwareApplication: buildSoftwareApplication,
    Course: buildCourse,
    JobPosting: buildJobPosting,
    Book: buildBook,
    Movie: buildMovie,
    MusicAlbum: buildMusicAlbum,
    Dataset: buildDataset,
    ItemList: buildItemList,
    WebSite: buildWebSite,
    PodcastEpisode: buildPodcastEpisode,
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

export function parseJsonLd(jsonString: string): { type: SchemaType; data: Record<string, unknown> } | null {
    try {
        const parsed = JSON.parse(jsonString)
        if (!parsed || !parsed["@type"]) return null
        const schemaType = parsed["@type"] as SchemaType
        if (!BUILDERS[schemaType]) return null
        return { type: schemaType, data: parsed }
    } catch {
        return null
    }
}

export function getSchemaConnections(entries: SchemaEntry[]): Array<{ from: string; to: string; relationship: string }> {
    const connections: Array<{ from: string; to: string; relationship: string }> = []

    for (const entry of entries) {
        const jsonld = generateJsonLd(entry)

        if (jsonld.author && typeof jsonld.author === "object") {
            const authorName = (jsonld.author as Record<string, unknown>).name as string
            if (authorName) {
                const match = entries.find((e) => e.type === "Person" && e.data.name === authorName && e.id !== entry.id)
                if (match) connections.push({ from: entry.id, to: match.id, relationship: "author" })
            }
        }

        if (jsonld.publisher && typeof jsonld.publisher === "object") {
            const pubName = (jsonld.publisher as Record<string, unknown>).name as string
            if (pubName) {
                const match = entries.find((e) => e.type === "Organization" && e.data.name === pubName && e.id !== entry.id)
                if (match) connections.push({ from: entry.id, to: match.id, relationship: "publisher" })
            }
        }

        if (jsonld.hiringOrganization && typeof jsonld.hiringOrganization === "object") {
            const orgName = (jsonld.hiringOrganization as Record<string, unknown>).name as string
            if (orgName) {
                const match = entries.find((e) => e.type === "Organization" && e.data.name === orgName && e.id !== entry.id)
                if (match) connections.push({ from: entry.id, to: match.id, relationship: "hiring organization" })
            }
        }
    }

    return connections
}
