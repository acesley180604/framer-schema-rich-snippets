import { useState, useMemo, memo, useCallback } from "react"
import type { SchemaType, SchemaCategory } from "@/schemas/types"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS, SCHEMA_TYPE_DESCRIPTIONS, SCHEMA_CATEGORIES } from "@/schemas/types"

interface SchemaTypeSelectorProps {
    onSelect: (type: SchemaType) => void
    onClose: () => void
}

const CATEGORY_LABELS: Record<SchemaCategory, string> = {
    Content: "Content",
    Commerce: "Commerce",
    Local: "Local Business",
    Business: "Business",
    Events: "Events",
    Media: "Media",
    Education: "Education",
    Jobs: "Jobs",
    Navigation: "Navigation",
    Technical: "Technical",
}

const SchemaTypeCard = memo(function SchemaTypeCard({
    type,
    onSelect,
}: {
    type: SchemaType
    onSelect: (type: SchemaType) => void
}) {
    return (
        <button
            onClick={() => onSelect(type)}
            className="card"
            style={{ textAlign: "left", width: "100%", padding: 10 }}
        >
            <div className="row gap-8">
                <div className="schema-icon">
                    {SCHEMA_TYPE_ICONS[type]}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                        {SCHEMA_TYPE_LABELS[type]}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--framer-color-text-secondary)", marginTop: 2 }}>
                        {SCHEMA_TYPE_DESCRIPTIONS[type]}
                    </div>
                </div>
            </div>
        </button>
    )
})

export default function SchemaTypeSelector({ onSelect, onClose }: SchemaTypeSelectorProps) {
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState<SchemaCategory | "all">("all")

    const allTypes = useMemo(() => {
        return Object.values(SCHEMA_CATEGORIES).flat()
    }, [])

    const filteredTypes = useMemo(() => {
        let types = activeCategory === "all" ? allTypes : (SCHEMA_CATEGORIES[activeCategory] || [])
        if (search.trim()) {
            const q = search.toLowerCase()
            types = types.filter(
                (t) =>
                    SCHEMA_TYPE_LABELS[t].toLowerCase().includes(q) ||
                    SCHEMA_TYPE_DESCRIPTIONS[t].toLowerCase().includes(q)
            )
        }
        return types
    }, [search, activeCategory, allTypes])

    const handleSelect = useCallback(
        (type: SchemaType) => {
            onSelect(type)
            onClose()
        },
        [onSelect, onClose]
    )

    return (
        <div className="overlay">
            <div className="modal">
                <div className="modal-header">
                    <div>
                        <h2 style={{ fontSize: 14 }}>Add Schema Type</h2>
                        <p style={{ marginTop: 2, fontSize: 10 }}>
                            {allTypes.length} types across {Object.keys(SCHEMA_CATEGORIES).length} categories
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        style={{ padding: "4px 8px" }}
                    >
                        x
                    </button>
                </div>

                <div style={{ padding: "10px 15px 0", borderBottom: "1px solid var(--framer-color-divider)" }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search schema types..."
                        style={{ marginBottom: 10 }}
                        autoFocus
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingBottom: 10 }}>
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={`segment-btn ${activeCategory === "all" ? "active" : ""}`}
                            style={{ padding: "3px 8px", fontSize: 10 }}
                        >
                            All
                        </button>
                        {(Object.keys(SCHEMA_CATEGORIES) as SchemaCategory[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`segment-btn ${activeCategory === cat ? "active" : ""}`}
                                style={{ padding: "3px 8px", fontSize: 10 }}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {filteredTypes.length === 0 && (
                        <p style={{ textAlign: "center", padding: 20, color: "var(--framer-color-text-tertiary)" }}>
                            No schema types match your search.
                        </p>
                    )}
                    {filteredTypes.map((type) => (
                        <SchemaTypeCard key={type} type={type} onSelect={handleSelect} />
                    ))}
                </div>
            </div>
        </div>
    )
}
