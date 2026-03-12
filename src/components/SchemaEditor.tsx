import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_FIELDS } from "@/schemas/fields"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"
import type { FieldDef } from "@/schemas/fields"

export default function SchemaEditor() {
    const { activeSchema, updateSchemaData, updateSchemaName, selectSchema } = useSchemaStore()
    const schema = activeSchema()

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

    // Group fields by their group property
    const groupedFields: { group: string | null; fields: FieldDef[] }[] = []
    let currentGroup: string | null = null
    let currentFields: FieldDef[] = []

    for (const field of fields) {
        const g = field.group || null
        if (g !== currentGroup) {
            if (currentFields.length > 0) {
                groupedFields.push({ group: currentGroup, fields: currentFields })
            }
            currentGroup = g
            currentFields = [field]
        } else {
            currentFields.push(field)
        }
    }
    if (currentFields.length > 0) {
        groupedFields.push({ group: currentGroup, fields: currentFields })
    }

    return (
        <div className="stack-lg">
            <div className="row-between">
                <button className="btn-link" onClick={() => selectSchema(null)}>
                    &larr; All Schemas
                </button>
                <span className="badge badge-info">{SCHEMA_TYPE_LABELS[schema.type]}</span>
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

            <hr />

            {/* Field groups */}
            {groupedFields.map((group, gi) => (
                <div key={gi} className="stack">
                    {group.group && (
                        <h3 style={{ textTransform: "capitalize" }}>
                            {group.group}
                        </h3>
                    )}
                    {group.fields.map((field) => (
                        <FieldRenderer
                            key={field.key}
                            field={field}
                            value={data[field.key]}
                            onChange={(val) => updateField(field.key, val)}
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

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
    switch (field.type) {
        case "text":
        case "url":
        case "number":
            return (
                <div>
                    <label>
                        {field.label}
                        {field.required && <span className="required-dot" />}
                        {field.recommended && !field.required && <span className="recommended-dot" />}
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
                </div>
            )

        case "textarea":
            return (
                <div>
                    <label>
                        {field.label}
                        {field.required && <span className="required-dot" />}
                        {field.recommended && !field.required && <span className="recommended-dot" />}
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
                        {field.required && <span className="required-dot" />}
                        {field.recommended && !field.required && <span className="recommended-dot" />}
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
                        {field.required && <span className="required-dot" />}
                        {field.recommended && !field.required && <span className="recommended-dot" />}
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
                        {field.required && <span className="required-dot" />}
                        {field.recommended && !field.required && <span className="recommended-dot" />}
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

        default:
            return null
    }
}

// ── FAQ List Editor ─────────────────────────────────────────────────────────

function FAQListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ question: string; answer: string }>) || []

    const addItem = () => {
        onChange([...items, { question: "", answer: "" }])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, key: "question" | "answer", val: string) => {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [key]: val } : item
        )
        onChange(updated)
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {(field as FieldDef).label}
                    {(field as FieldDef).required && <span className="required-dot" />}
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {(field as FieldDef).helpText && (
                <p style={{ fontSize: 10 }}>{(field as FieldDef).helpText}</p>
            )}
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

// ── Step List Editor ────────────────────────────────────────────────────────

function StepListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ name: string; text: string; image?: string }>) || []

    const addItem = () => {
        onChange([...items, { name: "", text: "" }])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, key: string, val: string) => {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [key]: val } : item
        )
        onChange(updated)
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {(field as FieldDef).label}
                    {(field as FieldDef).required && <span className="required-dot" />}
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add Step
                </button>
            </div>
            {(field as FieldDef).helpText && (
                <p style={{ fontSize: 10 }}>{(field as FieldDef).helpText}</p>
            )}
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

// ── Breadcrumb List Editor ──────────────────────────────────────────────────

function BreadcrumbListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ name: string; url: string }>) || []

    const addItem = () => {
        onChange([...items, { name: "", url: "" }])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, key: "name" | "url", val: string) => {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [key]: val } : item
        )
        onChange(updated)
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {(field as FieldDef).label}
                    {(field as FieldDef).required && <span className="required-dot" />}
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {(field as FieldDef).helpText && (
                <p style={{ fontSize: 10 }}>{(field as FieldDef).helpText}</p>
            )}
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => removeItem(i)} style={{ fontSize: 10 }}>
                            Remove
                        </button>
                    </div>
                    <div className="grid-2">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(i, "name", e.target.value)}
                            placeholder="Page name"
                        />
                        <input
                            type="url"
                            value={item.url}
                            onChange={(e) => updateItem(i, "url", e.target.value)}
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

// ── String List Editor ──────────────────────────────────────────────────────

function StringListEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as string[]) || []

    const addItem = () => {
        onChange([...items, ""])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, val: string) => {
        const updated = items.map((item, i) => (i === index ? val : item))
        onChange(updated)
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {(field as FieldDef).label}
                    {(field as FieldDef).required && <span className="required-dot" />}
                    {(field as FieldDef).recommended && !(field as FieldDef).required && <span className="recommended-dot" />}
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add
                </button>
            </div>
            {(field as FieldDef).helpText && (
                <p style={{ fontSize: 10 }}>{(field as FieldDef).helpText}</p>
            )}
            {items.map((item, i) => (
                <div key={i} className="row gap-4">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(i, e.target.value)}
                        placeholder={`Item ${i + 1}`}
                        style={{ flex: 1 }}
                    />
                    <button className="btn-danger" onClick={() => removeItem(i)} style={{ fontSize: 10 }}>
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

// ── Opening Hours Editor ────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function OpeningHoursEditor({ value, onChange, field }: FieldRendererProps) {
    const items = (value as Array<{ dayOfWeek: string[]; opens: string; closes: string }>) || []

    const addItem = () => {
        onChange([...items, { dayOfWeek: ["Monday"], opens: "09:00", closes: "17:00" }])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, key: string, val: unknown) => {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [key]: val } : item
        )
        onChange(updated)
    }

    const toggleDay = (index: number, day: string) => {
        const current = items[index].dayOfWeek
        const updated = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day]
        updateItem(index, "dayOfWeek", updated)
    }

    return (
        <div className="stack">
            <div className="row-between">
                <label style={{ marginBottom: 0 }}>
                    {(field as FieldDef).label}
                    {(field as FieldDef).recommended && <span className="recommended-dot" />}
                </label>
                <button className="btn-secondary" onClick={addItem} style={{ padding: "3px 8px", fontSize: 10 }}>
                    + Add Hours
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="card" style={{ padding: 8 }}>
                    <div className="row-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-text-tertiary)" }}>
                            Schedule #{i + 1}
                        </span>
                        <button className="btn-danger" onClick={() => removeItem(i)} style={{ fontSize: 10 }}>
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
                                    onChange={(e) => updateItem(i, "opens", e.target.value)}
                                    placeholder="09:00"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 10 }}>Closes</label>
                                <input
                                    type="text"
                                    value={item.closes}
                                    onChange={(e) => updateItem(i, "closes", e.target.value)}
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
