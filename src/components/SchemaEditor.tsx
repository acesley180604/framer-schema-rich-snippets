import { useCallback, useState } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_FIELDS } from "@/schemas/fields"
import { SCHEMA_TYPE_LABELS, RICH_RESULT_INFO } from "@/schemas/types"
import type { FieldDef } from "@/schemas/fields"
// SchemaType used in orgSchemas/personSchemas filtering

export default function SchemaEditor() {
    const { activeSchema, updateSchemaData, updateSchemaName, selectSchema, showToast, schemas } = useSchemaStore()
    const schema = activeSchema()
    const [fetchingUrl, setFetchingUrl] = useState(false)

    const handleFetchFromUrl = useCallback(async () => {
        if (!schema) return
        const url = prompt("Enter a URL to auto-fill schema fields from:")
        if (!url) return

        setFetchingUrl(true)
        try {
            const res = await fetch(url)
            const html = await res.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, "text/html")

            const updates: Record<string, unknown> = {}
            let count = 0

            // Extract title
            const title = doc.querySelector("title")?.textContent?.trim()
            if (title) {
                if ("headline" in (schema.data || {})) { updates.headline = title; count++ }
                else if ("name" in (schema.data || {})) { updates.name = title; count++ }
                else { updates.headline = title; count++ }
            }

            // Extract meta description
            const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim()
            if (metaDesc) { updates.description = metaDesc; count++ }

            // Extract og:image
            const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim()
            if (ogImage) { updates.image = ogImage; count++ }

            // Extract canonical URL
            const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim()
            if (canonical) { updates.url = canonical; count++ }

            // Extract lang
            const lang = doc.documentElement.getAttribute("lang")
            if (lang) { updates.inLanguage = lang; count++ }

            // Extract author
            const author = doc.querySelector('meta[name="author"]')?.getAttribute("content")?.trim()
            if (author) { updates.authorName = author; count++ }

            if (count > 0) {
                updateSchemaData(schema.id, updates)
                showToast(`Auto-filled ${count} field${count !== 1 ? "s" : ""} from page content`, "success")
            } else {
                showToast("No fields could be auto-filled from this URL", "info")
            }
        } catch (e) {
            showToast("Failed to fetch URL. It may have CORS restrictions.", "error")
        } finally {
            setFetchingUrl(false)
        }
    }, [schema, updateSchemaData, showToast])

    if (!schema) {
        return (
            <div className="empty-state">
                <p>Select a schema from the Schemas tab to edit it.</p>
            </div>
        )
    }

    const fields = SCHEMA_FIELDS[schema.type]
    const data = schema.data

    const updateField = (key: string, value: unknown) => {
        updateSchemaData(schema.id, { [key]: value })
    }

    // Get existing Organization and Person schemas for nesting/references
    const orgSchemas = schemas.filter((s) => s.type === "Organization" && s.id !== schema.id)
    const personSchemas = schemas.filter((s) => s.type === "Person" && s.id !== schema.id)

    // Group fields by their group property
    const groupedFields: { group: string | null; fields: FieldDef[] }[] = []
    let currentGroup: string | null = null
    let currentFields: FieldDef[] = []

    for (const f of fields) {
        const g = f.group || null
        if (g !== currentGroup) {
            if (currentFields.length > 0) {
                groupedFields.push({ group: currentGroup, fields: currentFields })
            }
            currentGroup = g
            currentFields = [f]
        } else {
            currentFields.push(f)
        }
    }
    if (currentFields.length > 0) {
        groupedFields.push({ group: currentGroup, fields: currentFields })
    }

    // Count field importance
    const requiredCount = fields.filter((f) => f.importance === "required").length
    const recommendedCount = fields.filter((f) => f.importance === "recommended").length
    const optionalCount = fields.filter((f) => f.importance === "optional").length

    return (
        <div className="stack-lg">
            <div className="row-between">
                <button className="btn-link" onClick={() => selectSchema(null)}>
                    &larr; All Schemas
                </button>
                <span className="badge badge-info">{SCHEMA_TYPE_LABELS[schema.type]}</span>
            </div>

            {/* Rich result info */}
            <div className="info-box info-box-tint">
                <strong style={{ fontSize: 11 }}>Rich Result:</strong>{" "}
                <span style={{ fontSize: 11 }}>{RICH_RESULT_INFO[schema.type]}</span>
            </div>

            {/* Field importance legend */}
            <div className="row gap-10" style={{ fontSize: 10 }}>
                <span className="row gap-4">
                    <span className="required-dot" /> Required ({requiredCount})
                </span>
                <span className="row gap-4">
                    <span className="recommended-dot" /> Recommended ({recommendedCount})
                </span>
                <span className="row gap-4">
                    <span className="optional-dot" /> Optional ({optionalCount})
                </span>
            </div>

            {/* Schema name */}
            <div>
                <label>Schema Name</label>
                <input
                    type="text"
                    value={schema.name}
                    onChange={(e) => updateSchemaName(schema.id, e.target.value)}
                    placeholder="Schema name (for your reference)"
                />
            </div>

            {/* Fetch from URL */}
            <button
                className="btn-secondary"
                onClick={() => void handleFetchFromUrl()}
                disabled={fetchingUrl}
                style={{ fontSize: 11, padding: "6px 12px" }}
            >
                {fetchingUrl ? "Fetching..." : "Fetch from URL"}
            </button>

            {/* Schema references for author/publisher fields */}
            {(schema.type === "Article" || schema.type === "NewsArticle" || schema.type === "BlogPosting") && (
                <>
                    {personSchemas.length > 0 && (
                        <div>
                            <label style={{ fontSize: 10 }}>Link Author from existing Person schema</label>
                            <select
                                value=""
                                onChange={(e) => {
                                    const selected = personSchemas.find((s) => s.id === e.target.value)
                                    if (selected) {
                                        updateSchemaData(schema.id, {
                                            authorName: selected.data.name || "",
                                            authorUrl: selected.data.url || "",
                                        })
                                        showToast(`Linked author from "${selected.name}"`, "success")
                                    }
                                }}
                                style={{ fontSize: 11 }}
                            >
                                <option value="">Select a Person schema...</option>
                                {personSchemas.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.data.name as string || "unnamed"})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {orgSchemas.length > 0 && (
                        <div>
                            <label style={{ fontSize: 10 }}>Link Publisher from existing Organization schema</label>
                            <select
                                value=""
                                onChange={(e) => {
                                    const selected = orgSchemas.find((s) => s.id === e.target.value)
                                    if (selected) {
                                        updateSchemaData(schema.id, {
                                            publisherName: selected.data.name || "",
                                            publisherLogo: selected.data.logo || "",
                                        })
                                        showToast(`Linked publisher from "${selected.name}"`, "success")
                                    }
                                }}
                                style={{ fontSize: 11 }}
                            >
                                <option value="">Select an Organization schema...</option>
                                {orgSchemas.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.data.name as string || "unnamed"})</option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}

            {/* Schema references for JobPosting hiring org */}
            {schema.type === "JobPosting" && orgSchemas.length > 0 && (
                <div>
                    <label style={{ fontSize: 10 }}>Link Hiring Organization from existing Organization schema</label>
                    <select
                        value=""
                        onChange={(e) => {
                            const selected = orgSchemas.find((s) => s.id === e.target.value)
                            if (selected) {
                                updateSchemaData(schema.id, {
                                    hiringOrganizationName: selected.data.name || "",
                                    hiringOrganizationUrl: selected.data.url || "",
                                    hiringOrganizationLogo: selected.data.logo || "",
                                })
                                showToast(`Linked hiring org from "${selected.name}"`, "success")
                            }
                        }}
                        style={{ fontSize: 11 }}
                    >
                        <option value="">Select an Organization schema...</option>
                        {orgSchemas.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.data.name as string || "unnamed"})</option>
                        ))}
                    </select>
                </div>
            )}

            <hr />

            {/* Field groups */}
            {groupedFields.map((group, gi) => (
                <div key={gi} className="stack">
                    {group.group && (
                        <h3 style={{ textTransform: "capitalize" }}>
                            {group.group}
                        </h3>
                    )}
                    {group.fields.map((f) => (
                        <FieldRenderer
                            key={f.key}
                            field={f}
                            value={data[f.key]}
                            onChange={(val) => updateField(f.key, val)}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

interface FieldRendererProps {
    field: FieldDef
    value: unknown
    onChange: (value: unknown) => void
}

function ImportanceIndicator({ field }: { field: FieldDef }) {
    return (
        <>
            {field.importance === "required" && <span className="required-dot" title="Required by Google" />}
            {field.importance === "recommended" && <span className="recommended-dot" title="Recommended for rich results" />}
            {field.importance === "optional" && <span className="optional-dot" title="Optional" />}
        </>
    )
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
    switch (field.type) {
        case "text":
        case "url":
        case "number":
            return (
                <div>
                    <label>
                        {field.label}
                        <ImportanceIndicator field={field} />
                    </label>
                    <input
                        type={field.type === "number" ? "text" : field.type}
                        value={(value as string) || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                    />
                    {field.helpText && (
                        <p style={{ marginTop: 2, fontSize: 10 }}>{field.helpText}</p>
                    )}
                    {field.googleRequirement && (
                        <p style={{ marginTop: 2, fontSize: 10, color: "var(--framer-color-tint)" }}>
                            {field.googleRequirement}
                        </p>
                    )}
                </div>
            )

        case "textarea":
            return (
                <div>
                    <label>
                        {field.label}
                        <ImportanceIndicator field={field} />
                    </label>
                    <textarea
                        rows={3}
                        value={(value as string) || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                    />
                </div>
            )

        case "date":
            return (
                <div>
                    <label>
                        {field.label}
                        <ImportanceIndicator field={field} />
                    </label>
                    <input
                        type="date"
                        value={(value as string) || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            )

        case "datetime":
            return (
                <div>
                    <label>
                        {field.label}
                        <ImportanceIndicator field={field} />
                    </label>
                    <input
                        type="datetime-local"
                        value={(value as string) || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            )

        case "select":
            return (
                <div>
                    <label>
                        {field.label}
                        <ImportanceIndicator field={field} />
                    </label>
                    <select
                        value={(value as string) || ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            )

        case "faq-list":
            return <FAQListEditor value={value} onChange={onChange} field={field} />
        case "step-list":
            return <StepListEditor value={value} onChange={onChange} field={field} />
        case "breadcrumb-list":
            return <BreadcrumbListEditor value={value} onChange={onChange} field={field} />
        case "string-list":
            return <StringListEditor value={value} onChange={onChange} field={field} />
        case "opening-hours":
            return <OpeningHoursEditor value={value} onChange={onChange} field={field} />
        case "item-list":
            return <ItemListEditor value={value} onChange={onChange} field={field} />

        default:
            return null
    }
}

function FAQListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ question: string; answer: string }>) || []
    const f = field as FieldDef

    const addItem = useCallback(() => {
        onChange([...items, { question: "", answer: "" }])
    }, [items, onChange])

    const removeItem = useCallback(
        (index: number) => {
            onChange(items.filter((_, i) => i !== index))
        },
        [items, onChange]
    )

    const updateItem = useCallback(
        (index: number, key: "question" | "answer", val: string) => {
            const updated = items.map((item, i) =>
                i === index ? { ...item, [key]: val } : item
            )
            onChange(updated)
        },
        [items, onChange]
    )

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {f.helpText && <p style={{ fontSize: 10 }}>{f.helpText}</p>}
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            Q&A #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => removeItem(i)} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="stack-sm">
                        <input
                            type="text"
                            value={item.question}
                            onChange={(e) => updateItem(i, "question", e.target.value)}
                            placeholder="Question"
                        />
                        <textarea
                            rows={2}
                            value={item.answer}
                            onChange={(e) => updateItem(i, "answer", e.target.value)}
                            placeholder="Answer"
                        />
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No items yet. Click + Add to add a Q&A pair.
                </p>
            )}
        </div>
    )
}

function StepListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ name: string; text: string; image?: string }>) || []
    const f = field as FieldDef

    const addItem = useCallback(() => {
        onChange([...items, { name: "", text: "" }])
    }, [items, onChange])

    const removeItem = useCallback(
        (index: number) => {
            onChange(items.filter((_, i) => i !== index))
        },
        [items, onChange]
    )

    const updateItem = useCallback(
        (index: number, key: string, val: string) => {
            const updated = items.map((item, i) =>
                i === index ? { ...item, [key]: val } : item
            )
            onChange(updated)
        },
        [items, onChange]
    )

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add Step
                </button>
            </div>
            {f.helpText && <p style={{ fontSize: 10 }}>{f.helpText}</p>}
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            Step {i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => removeItem(i)} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="stack-sm">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(i, "name", e.target.value)}
                            placeholder="Step name (optional)"
                        />
                        <textarea
                            rows={2}
                            value={item.text}
                            onChange={(e) => updateItem(i, "text", e.target.value)}
                            placeholder="Step instructions"
                        />
                        <input
                            type="url"
                            value={item.image || ""}
                            onChange={(e) => updateItem(i, "image", e.target.value)}
                            placeholder="Step image URL (optional)"
                        />
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No steps yet. Click + Add Step to add one.
                </p>
            )}
        </div>
    )
}

function BreadcrumbListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ name: string; url: string }>) || []
    const f = field as FieldDef

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={() => onChange([...items, { name: "", url: "" }])} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {f.helpText && <p style={{ fontSize: 10 }}>{f.helpText}</p>}
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="grid-2">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it))}
                            placeholder="Page name"
                        />
                        <input
                            type="url"
                            value={item.url}
                            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, url: e.target.value } : it))}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No breadcrumbs yet. Click + Add to add one.
                </p>
            )}
        </div>
    )
}

function StringListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as string[]) || []
    const f = field as FieldDef

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={() => onChange([...items, ""])} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {f.helpText && <p style={{ fontSize: 10 }}>{f.helpText}</p>}
            {items.map((item, i) => (
                <div key={i} className="row gap-4">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => onChange(items.map((it, idx) => idx === i ? e.target.value : it))}
                        placeholder={`Item ${i + 1}`}
                        style={{ flex: 1 }}
                    />
                    <button className="btn-danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ fontSize: 10 }}>
                        x
                    </button>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No items. Click + Add.
                </p>
            )}
        </div>
    )
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function OpeningHoursEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ dayOfWeek: string[]; opens: string; closes: string }>) || []
    const f = field as FieldDef

    const toggleDay = (index: number, day: string) => {
        const current = items[index].dayOfWeek
        const updated = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day]
        onChange(items.map((item, i) => i === index ? { ...item, dayOfWeek: updated } : item))
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={() => onChange([...items, { dayOfWeek: ["Monday"], opens: "09:00", closes: "17:00" }])} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add Hours
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            Schedule #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="stack-sm">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {DAYS_OF_WEEK.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(i, day)}
                                    className={`segment-btn ${item.dayOfWeek.includes(day) ? "active" : ""}`}
                                    style={{ padding: "2px 6px", fontSize: 9 }}
                                >
                                    {day.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                        <div className="grid-2">
                            <div>
                                <label style={{ fontSize: 10 }}>Opens</label>
                                <input
                                    type="text"
                                    value={item.opens}
                                    onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, opens: e.target.value } : it))}
                                    placeholder="09:00"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 10 }}>Closes</label>
                                <input
                                    type="text"
                                    value={item.closes}
                                    onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, closes: e.target.value } : it))}
                                    placeholder="17:00"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No hours set. Click + Add Hours.
                </p>
            )}
        </div>
    )
}

function ItemListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ name: string; url: string }>) || []
    const f = field as FieldDef

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {f.label}
                    <ImportanceIndicator field={f} />
                </label>
                <button className="btn-secondary" onClick={() => onChange([...items, { name: "", url: "" }])} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add Item
                </button>
            </div>
            {f.helpText && <p style={{ fontSize: 10 }}>{f.helpText}</p>}
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="stack-sm">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it))}
                            placeholder="Item name"
                        />
                        <input
                            type="url"
                            value={item.url}
                            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, url: e.target.value } : it))}
                            placeholder="Item URL (optional)"
                        />
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--framer-color-text-tertiary)" }}>
                    No items. Click + Add Item.
                </p>
            )}
        </div>
    )
}
