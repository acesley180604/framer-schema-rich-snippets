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
                    })
                } else {
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].question?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Question #${i + 1} is empty.`,
                            })
                        }
                        if (!items[i].answer?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Answer #${i + 1} is empty.`,
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
                    })
                } else {
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].text?.trim()) {
                            results.push({
                                field: `${field.label} #${i + 1}`,
                                level: "error",
                                message: `Step #${i + 1} text is empty.`,
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
                    })
                } else {
                    for (let i = 0; i < items.length; i++) {
                        if (!items[i].name?.trim()) {
                            results.push({
                                field: `Breadcrumb #${i + 1}`,
                                level: "error",
                                message: `Breadcrumb #${i + 1} name is empty.`,
                            })
                        }
                        if (!items[i].url?.trim()) {
                            results.push({
                                field: `Breadcrumb #${i + 1}`,
                                level: "error",
                                message: `Breadcrumb #${i + 1} URL is empty.`,
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
                    })
                }
            } else {
                const str = typeof value === "string" ? value.trim() : value
                if (!str && str !== 0) {
                    results.push({
                        field: field.label,
                        level: "error",
                        message: `${field.label} is required.`,
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
                        })
                    }
                } else {
                    results.push({
                        field: field.label,
                        level: "warning",
                        message: `${field.label} is recommended for better rich snippet results.`,
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
                })
            }
        }

        // Date validation
        if ((field.type === "date" || field.type === "datetime") && value && typeof value === "string" && value.trim()) {
            const d = new Date(value.trim())
            if (isNaN(d.getTime())) {
                results.push({
                    field: field.label,
                    level: "error",
                    message: `${field.label} must be a valid date.`,
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
                })
            }
        }
    }

    return results
}

export function getValidationSummary(results: ValidationResult[]): {
    errors: number
    warnings: number
    status: "valid" | "warning" | "error"
} {
    const errors = results.filter((r) => r.level === "error").length
    const warnings = results.filter((r) => r.level === "warning").length
    return {
        errors,
        warnings,
        status: errors > 0 ? "error" : warnings > 0 ? "warning" : "valid",
    }
}
