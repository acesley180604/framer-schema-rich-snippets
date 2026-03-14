import { useState, useMemo, memo, useCallback } from "react"
import { SCHEMA_TEMPLATES, getTemplatesByCategory } from "@/schemas/templates"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"
import type { SchemaTemplate } from "@/schemas/templates"

interface TemplateGalleryProps {
    onApplied: () => void
}

const TemplateCard = memo(function TemplateCard({
    template,
    onSelect,
}: {
    template: SchemaTemplate
    onSelect: (template: SchemaTemplate) => void
}) {
    return (
        <button
            onClick={() => onSelect(template)}
            className="card"
            style={{ textAlign: "left", width: "100%", padding: 10 }}
        >
            <div className="row gap-8" style={{ alignItems: "flex-start" }}>
                <div className="schema-icon">
                    {SCHEMA_TYPE_ICONS[template.type]}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                        {template.name}
                    </div>
                    <div className="line-clamp-2" style={{ fontSize: 10, color: "var(--framer-color-text-secondary)", marginTop: 2 }}>
                        {template.description}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--framer-color-text-tertiary)", marginTop: 4 }}>
                        {SCHEMA_TYPE_LABELS[template.type]}
                    </div>
                </div>
            </div>
        </button>
    )
})

export default function TemplateGallery({ onApplied }: TemplateGalleryProps) {
    const { applyTemplate, showToast } = useSchemaStore()
    const [search, setSearch] = useState("")
    const grouped = useMemo(() => getTemplatesByCategory(), [])

    const handleSelect = useCallback(
        (template: SchemaTemplate) => {
            applyTemplate(template.type, template.data, template.name)
            showToast(`Template "${template.name}" applied`, "success")
            onApplied()
        },
        [applyTemplate, showToast, onApplied]
    )

    const filteredGrouped = useMemo(() => {
        if (!search.trim()) return grouped
        const q = search.toLowerCase()
        const result: Record<string, SchemaTemplate[]> = {}
        for (const [category, templates] of Object.entries(grouped)) {
            const filtered = templates.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    SCHEMA_TYPE_LABELS[t.type].toLowerCase().includes(q)
            )
            if (filtered.length > 0) {
                result[category] = filtered
            }
        }
        return result
    }, [search, grouped])

    const totalFiltered = useMemo(() => {
        return Object.values(filteredGrouped).reduce((sum, arr) => sum + arr.length, 0)
    }, [filteredGrouped])

    return (
        <div className="stack-lg">
            <section>
                <h2>Template Gallery</h2>
                <p style={{ marginTop: 4 }}>
                    {SCHEMA_TEMPLATES.length} pre-built templates -- click to add.
                </p>
            </section>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
            />

            {totalFiltered === 0 && (
                <p style={{ textAlign: "center", color: "var(--framer-color-text-tertiary)" }}>
                    No templates match your search.
                </p>
            )}

            {Object.entries(filteredGrouped).map(([category, templates]) => (
                <section key={category}>
                    <h3 style={{ marginBottom: 8 }}>{category}</h3>
                    <div className="stack-sm">
                        {templates.map((template) => (
                            <TemplateCard key={template.id} template={template} onSelect={handleSelect} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
