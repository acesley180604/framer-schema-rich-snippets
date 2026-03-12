import { SCHEMA_TEMPLATES, getTemplatesByCategory } from "@/schemas/templates"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"
import type { SchemaTemplate } from "@/schemas/templates"

interface TemplateGalleryProps {
    onApplied: () => void
}

export default function TemplateGallery({ onApplied }: TemplateGalleryProps) {
    const { applyTemplate, showToast } = useSchemaStore()
    const grouped = getTemplatesByCategory()

    const handleSelect = (template: SchemaTemplate) => {
        applyTemplate(template.type, template.data, template.name)
        showToast(`Template "${template.name}" applied`, "success")
        onApplied()
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Template Gallery</h2>
                <p style={{ marginTop: 4 }}>
                    {SCHEMA_TEMPLATES.length} pre-built templates -- click to add.
                </p>
            </section>

            {Object.entries(grouped).map(([category, templates]) => (
                <section key={category}>
                    <h3 style={{ marginBottom: 8 }}>{category}</h3>
                    <div className="stack-sm">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleSelect(template)}
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
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
