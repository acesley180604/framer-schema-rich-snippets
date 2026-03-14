import { useState, memo, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"
import { validateSchema, getValidationSummary, calculateHealthScore } from "@/schemas/validator"
import SchemaTypeSelector from "./SchemaTypeSelector"

interface SchemaListProps {
    onEditSchema: () => void
}

const SchemaCard = memo(function SchemaCard({
    schema,
    isActive,
    onSelect,
    onDuplicate,
    onRemove,
}: {
    schema: { id: string; type: keyof typeof SCHEMA_TYPE_LABELS; name: string; data: Record<string, unknown> }
    isActive: boolean
    onSelect: (id: string) => void
    onDuplicate: (id: string) => void
    onRemove: (id: string) => void
}) {
    const results = validateSchema(schema.type, schema.data)
    const summary = getValidationSummary(results)
    const healthScore = calculateHealthScore(schema.type, schema.data)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`card ${isActive ? "card-active" : ""}`}
            style={{ padding: 10, cursor: "pointer" }}
            onClick={() => onSelect(schema.id)}
        >
            <div className="row-between">
                <div className="row gap-8">
                    <div className="schema-icon">
                        {SCHEMA_TYPE_ICONS[schema.type]}
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>
                            {schema.name}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginTop: 2 }}>
                            {SCHEMA_TYPE_LABELS[schema.type]}
                        </div>
                    </div>
                </div>
                <div className="row gap-6">
                    <div className="health-score-mini" style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: healthScore >= 70 ? "#276749" : healthScore >= 50 ? "#975a16" : "#9b2c2c",
                    }}>
                        {healthScore}
                    </div>
                    <span className={`badge badge-${summary.status}`}>
                        {summary.status === "valid"
                            ? "Valid"
                            : summary.status === "warning"
                              ? `${summary.warnings}w`
                              : `${summary.errors}e`}
                    </span>
                    <button
                        className="btn-link"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDuplicate(schema.id)
                        }}
                        title="Duplicate"
                        style={{ fontSize: 13 }}
                    >
                        ++
                    </button>
                    <button
                        className="btn-danger"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove(schema.id)
                        }}
                        title="Remove"
                    >
                        x
                    </button>
                </div>
            </div>
        </motion.div>
    )
})

export default function SchemaList({ onEditSchema }: SchemaListProps) {
    const [showSelector, setShowSelector] = useState(false)
    const { schemas, activeSchemaId, addSchema, removeSchema, duplicateSchema, selectSchema } = useSchemaStore()

    const handleAdd = useCallback(() => {
        setShowSelector(true)
    }, [])

    const handleSelect = useCallback(
        (id: string) => {
            selectSchema(id)
            onEditSchema()
        },
        [selectSchema, onEditSchema]
    )

    if (schemas.length === 0) {
        return (
            <>
                <div className="empty-state">
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--framer-color-text)" }}>
                        No schemas added yet
                    </p>
                    <p>Add structured data to improve your SEO rich snippets in search results.</p>
                    <button className="framer-button-primary" onClick={handleAdd} style={{ marginTop: 8 }}>
                        + Add Schema
                    </button>
                </div>

                <div className="info-box info-box-default" style={{ marginTop: 10 }}>
                    <strong>What is structured data?</strong>
                    <br />
                    Schema.org markup (JSON-LD) helps search engines understand your content and display rich snippets -- star ratings, FAQ dropdowns, recipe cards, event details, and more.
                </div>

                {showSelector && (
                    <SchemaTypeSelector
                        onSelect={(type) => {
                            addSchema(type)
                            onEditSchema()
                        }}
                        onClose={() => setShowSelector(false)}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <div className="row-between">
                <h2>{schemas.length} Schema{schemas.length !== 1 ? "s" : ""}</h2>
                <button className="framer-button-primary" onClick={handleAdd} style={{ padding: "5px 10px", fontSize: 11 }}>
                    + Add
                </button>
            </div>

            <div className="stack-sm">
                <AnimatePresence>
                    {schemas.map((schema) => (
                        <SchemaCard
                            key={schema.id}
                            schema={schema}
                            isActive={schema.id === activeSchemaId}
                            onSelect={handleSelect}
                            onDuplicate={duplicateSchema}
                            onRemove={removeSchema}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {showSelector && (
                <SchemaTypeSelector
                    onSelect={(type) => {
                        addSchema(type)
                        onEditSchema()
                    }}
                    onClose={() => setShowSelector(false)}
                />
            )}
        </>
    )
}
