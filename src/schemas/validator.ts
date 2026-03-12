import type { SchemaType, ValidationResult } from "./types"
import { SCHEMA_FIELDS } from "./fields"

export function validateSchema(type: SchemaType, data: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = []
    const fields = SCHEMA_FIELDS[type]

    for (const field of fields) {
        const value = data[field.key]

        // Check required fields
        if (field.required) {
            if (field.type === "faq-list") {
                const items = value as Array<{ question: string; answer: string }> | undefined
                if (!items || items.length === 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required. Add at least one item.`,
                        suggestion: "Add at least one question and answer pair for FAQ rich results.",
                    })
                } else {
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].question?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Question #${i + 1} is empty.`,
                                suggestion: "Enter the question text.",
                            })
                        }
                        if (!items[i].answer?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Answer #${i + 1} is empty.`,
                                suggestion: "Provide a detailed answer. Google favors answers between 50-300 characters.",
                            })
                        }
                    }
                }
            } else if (field.type === "step-list") {
                const items = value as Array<{ name: string; text: string }> | undefined
                if (!items || items.length === 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required. Add at least one step.`,
                        suggestion: "Add at least 2 steps for best results.",
                    })
                } else {
                    if (items.length < 2) {
                        results.push({
                            field: field.label,
                            level: "warning",
                            message: "Google recommends at least 2 steps for HowTo rich results.",
                            suggestion: "Add more steps for a richer snippet appearance.",
                        })
                    }
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].text?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Step #${i + 1} text is empty.`,
                                suggestion: "Describe what to do in this step.",
                            })
                        }
                    }
                }
            } else if (field.type === "breadcrumb-list") {
                const items = value as Array<{ name: string; url: string }> | undefined
                if (!items || items.length === 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required. Add at least one breadcrumb.`,
                        suggestion: "Add at least 2 breadcrumb items (Home + current page).",
                    })
                } else {
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].name?.trim()) {
                            results.push({
                                field: `Breadcrumb #${i + 1}`,
                                level: "error",
                                message: `Breadcrumb #${i + 1} name is empty.`,
                                suggestion: "Enter the page name for this breadcrumb.",
                            })
                        }
                        if (!items[i].url?.trim()) {
                            results.push({
                                field: `Breadcrumb #${i + 1}`,
                                level: "error",
                                message: `Breadcrumb #${i + 1} URL is empty.`,
                                suggestion: "Enter the full URL for this breadcrumb page.",
                            })
                        }
                    }
                }
            } else if (field.type === "string-list") {
                const items = value as string[] | undefined
                if (!items || items.length === 0 || items.every((s) => !s.trim())) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required. Add at least one item.`,
                        suggestion: `Add at least one ${field.label.toLowerCase()} entry.`,
                    })
                }
            } else if (field.type === "item-list") {
                const items = value as Array<{ name: string; url: string }> | undefined
                if (!items || items.length === 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required. Add at least one item.`,
                        suggestion: "Add items to the list with name and URL.",
                    })
                }
            } else {
                const str = typeof value === "string" ? value.trim() : value
                if (!str && str !== 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required.`,
                        suggestion: field.googleRequirement || `Fill in the ${field.label.toLowerCase()} field.`,
                    })
                }
            }
        }

        // Check recommended fields
        if (field.recommended && !field.required) {
            const str = typeof value === "string" ? value.trim() : value
            if (!str && str !== 0) {
                if (field.type === "string-list") {
                    const items = value as string[] | undefined
                    if (!items || items.length === 0 || items.every((s) => !s.trim())) {
                        results.push({
                            field: field.label,
                            level: "warning",
                            message: `${field.label} is recommended for better rich snippet results.`,
                            suggestion: `Adding ${field.label.toLowerCase()} improves your chances of getting rich results.`,
                        })
                    }
                } else if (field.type === "opening-hours") {
                    const items = value as Array<unknown> | undefined
                    if (!items || items.length === 0) {
                        results.push({
                            field: field.label,
                            level: "warning",
                            message: `${field.label} is recommended for local business schemas.`,
                            suggestion: "Adding opening hours helps Google show your business hours in search results.",
                        })
                    }
                } else {
                    results.push({
                        field: field.label,
                        level: "warning",
                        message: `${field.label} is recommended for better rich snippet results.`,
                        suggestion: field.googleRequirement || `Adding ${field.label.toLowerCase()} improves your schema quality.`,
                    })
                }
            }
        }

        // URL validation
        if (field.type === "url" && value && typeof value === "string" && value.trim()) {
            if (!/^https?:\/\/.+/.test(value.trim())) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: `${field.label} must be a valid URL starting with http:// or https://`,
                    suggestion: "Ensure the URL starts with https:// and is a valid web address.",
                })
            }
        }

        // Date validation (ISO 8601)
        if ((field.type === "date" || field.type === "datetime") && value && typeof value === "string" && value.trim()) {
            const d = new Date(value.trim())
            if (isNaN(d.getTime())) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: `${field.label} must be a valid date in ISO 8601 format.`,
                    suggestion: "Use format YYYY-MM-DD for dates or YYYY-MM-DDTHH:MM for datetime.",
                })
            }
        }

        // Number validation
        if (field.type === "number" && value && typeof value === "string" && value.trim()) {
            if (isNaN(Number(value.trim()))) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: `${field.label} must be a valid number.`,
                    suggestion: "Enter a numeric value (e.g. 4.5, 29.99, 100).",
                })
            }
        }

        // ISO 8601 duration validation for specific fields
        if (field.key.includes("Time") || field.key === "duration") {
            if (value && typeof value === "string" && value.trim()) {
                if (!/^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/.test(value.trim())) {
                    results.push({
                        field: field.label,
                        level: "warning",
                        message: `${field.label} should be in ISO 8601 duration format.`,
                        suggestion: "Use format like PT30M (30 minutes), PT1H (1 hour), PT1H30M (1.5 hours).",
                    })
                }
            }
        }

        // Rating value range check
        if (field.key === "ratingValue" && value && typeof value === "string" && value.trim()) {
            const num = Number(value.trim())
            const best = Number((data.bestRating as string) || "5")
            if (!isNaN(num) && !isNaN(best) && num > best) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: `Rating value (${num}) exceeds best rating (${best}).`,
                    suggestion: "Rating value must be less than or equal to the best rating.",
                })
            }
            if (!isNaN(num) && num < 0) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: "Rating value cannot be negative.",
                    suggestion: "Enter a positive rating value.",
                })
            }
        }

        // Price validation
        if (field.key === "price" && value && typeof value === "string" && value.trim()) {
            const num = Number(value.trim())
            if (!isNaN(num) && num < 0) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: "Price cannot be negative.",
                    suggestion: "Enter 0 for free items or a positive price.",
                })
            }
        }
    }

    // Type-specific validation
    validateTypeSpecific(type, data, results)

    return results
}

function validateTypeSpecific(type: SchemaType, data: Record<string, unknown>, results: ValidationResult[]): void {
    switch (type) {
        case "Article":
        case "NewsArticle":
        case "BlogPosting": {
            const headline = data.headline as string | undefined
            if (headline && headline.length > 110) {
                results.push({
                    field: "Headline",
                    level: "warning",
                    message: "Headline exceeds 110 characters. Google may truncate it.",
                    suggestion: "Keep headlines under 110 characters for best display in search results.",
                })
            }
            break
        }
        case "Product": {
            if (!data.ratingValue && !data.reviewCount) {
                results.push({
                    field: "Rating/Reviews",
                    level: "info",
                    message: "Adding ratings or reviews increases click-through rates significantly.",
                    suggestion: "Add aggregate rating data to show star ratings in search results.",
                })
            }
            break
        }
        case "JobPosting": {
            if (!data.salaryValue && !data.salaryMinValue) {
                results.push({
                    field: "Salary",
                    level: "warning",
                    message: "Jobs with salary information get significantly more applications.",
                    suggestion: "Add salary range to improve job listing visibility.",
                })
            }
            break
        }
        case "Recipe": {
            const ingredients = data.recipeIngredient as string[] | undefined
            if (ingredients && ingredients.length < 2) {
                results.push({
                    field: "Ingredients",
                    level: "warning",
                    message: "Most recipes have at least 3-4 ingredients.",
                    suggestion: "Add more ingredients for a complete recipe.",
                })
            }
            break
        }
        case "WebSite": {
            const target = data.searchActionTarget as string | undefined
            if (target && !target.includes("{search_term_string}")) {
                results.push({
                    field: "Search URL Template",
                    level: "error",
                    message: "Search URL template must contain {search_term_string} placeholder.",
                    suggestion: "Add {search_term_string} to your URL template, e.g. https://example.com/search?q={search_term_string}",
                })
            }
            break
        }
    }
}

export function getValidationSummary(results: ValidationResult[]): {
    errors: number
    warnings: number
    infos: number
    status: "valid" | "warning" | "error"
} {
    const errors = results.filter((r) => r.level === "error").length
    const warnings = results.filter((r) => r.level === "warning").length
    const infos = results.filter((r) => r.level === "info").length
    return {
        errors,
        warnings,
        infos,
        status: errors > 0 ? "error" : warnings > 0 ? "warning" : "valid",
    }
}

export function calculateHealthScore(type: SchemaType, data: Record<string, unknown>): number {
    const fields = SCHEMA_FIELDS[type]
    if (fields.length === 0) return 100

    let totalWeight = 0
    let earnedWeight = 0

    for (const f of fields) {
        const weight = f.importance === "required" ? 3 : f.importance === "recommended" ? 2 : 1
        totalWeight += weight

        const val = data[f.key]
        let filled = false

        if (f.type === "faq-list") {
            const items = val as Array<{ question: string; answer: string }> | undefined
            filled = !!items && items.length > 0 && items.some((i) => i.question?.trim() && i.answer?.trim())
        } else if (f.type === "step-list") {
            const items = val as Array<{ name: string; text: string }> | undefined
            filled = !!items && items.length > 0 && items.some((i) => i.text?.trim())
        } else if (f.type === "breadcrumb-list" || f.type === "item-list") {
            const items = val as Array<unknown> | undefined
            filled = !!items && items.length > 0
        } else if (f.type === "string-list") {
            const items = val as string[] | undefined
            filled = !!items && items.length > 0 && items.some((s) => s.trim())
        } else if (f.type === "opening-hours") {
            const items = val as Array<unknown> | undefined
            filled = !!items && items.length > 0
        } else {
            const str = typeof val === "string" ? val.trim() : val
            filled = !!str || str === 0
        }

        if (filled) {
            earnedWeight += weight
        }
    }

    // Run validation - deduct for errors
    const results = validateSchema(type, data)
    const errors = results.filter((r) => r.level === "error").length
    const errorPenalty = Math.min(errors * 5, 30)

    const baseScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 100
    return Math.max(0, Math.min(100, baseScore - errorPenalty))
}

export function getHealthLabel(score: number): { label: string; color: string } {
    if (score >= 90) return { label: "Excellent", color: "#276749" }
    if (score >= 70) return { label: "Good", color: "#2f855a" }
    if (score >= 50) return { label: "Fair", color: "#975a16" }
    if (score >= 30) return { label: "Poor", color: "#c05621" }
    return { label: "Critical", color: "#9b2c2c" }
}
