import { useMemo } from "react"
import { motion } from "motion/react"
import { useSchemaStore } from "@/store/schemaStore"
import { validateSchema, getValidationSummary, calculateHealthScore, getHealthLabel } from "@/schemas/validator"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"

export default function Validator() {
    const { activeSchema, schemas } = useSchemaStore()
    const schema = activeSchema()

    const allResults = useMemo(() => {
        return schemas.map((s) => {
            const results = validateSchema(s.type, s.data)
            return {
                schema: s,
                results,
                summary: getValidationSummary(results),
                healthScore: calculateHealthScore(s.type, s.data),
            }
        })
    }, [schemas])

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to validate. Add one from the Schemas tab.</p>
            </div>
        )
    }

    const totalErrors = allResults.reduce((sum, r) => sum + r.summary.errors, 0)
    const totalWarnings = allResults.reduce((sum, r) => sum + r.summary.warnings, 0)
    const allValid = totalErrors === 0 && totalWarnings === 0
    const avgHealth = Math.round(allResults.reduce((sum, r) => sum + r.healthScore, 0) / allResults.length)
    const avgLabel = getHealthLabel(avgHealth)

    return (
        <div className="stack-lg">
            <section>
                <h2>Schema Validator</h2>
                <p style={{ marginTop: 4 }}>
                    Checks required, recommended, and optional fields for all schemas.
                </p>
            </section>

            {/* Overall health score */}
            <div className="health-score-card">
                <div className="health-score-ring">
                    <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle
                            cx="32" cy="32" r="28"
                            fill="none"
                            stroke="var(--framer-color-divider)"
                            strokeWidth="4"
                        />
                        <motion.circle
                            cx="32" cy="32" r="28"
                            fill="none"
                            stroke={avgLabel.color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - avgHealth / 100) }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            transform="rotate(-90 32 32)"
                        />
                    </svg>
                    <div className="health-score-value" style={{ color: avgLabel.color }}>
                        {avgHealth}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: avgLabel.color }}>{avgLabel.label}</div>
                    <div style={{ fontSize: 11, color: "var(--framer-color-text-secondary)", marginTop: 2 }}>
                        Average health score across {schemas.length} schema{schemas.length !== 1 ? "s" : ""}
                    </div>
                </div>
            </div>

            {/* Summary */}
            {allValid ? (
                <div className="info-box info-box-success">
                    All {schemas.length} schema{schemas.length !== 1 ? "s" : ""} pass validation. Your structured data is ready.
                </div>
            ) : (
                <div className={`info-box ${totalErrors > 0 ? "info-box-error" : "info-box-warn"}`}>
                    {totalErrors > 0 && <span>{totalErrors} error{totalErrors !== 1 ? "s" : ""}</span>}
                    {totalErrors > 0 && totalWarnings > 0 && <span> and </span>}
                    {totalWarnings > 0 && <span>{totalWarnings} warning{totalWarnings !== 1 ? "s" : ""}</span>}
                    {" "}across {schemas.length} schema{schemas.length !== 1 ? "s" : ""}.
                </div>
            )}

            {/* Per-schema results */}
            {allResults.map(({ schema: s, results, summary, healthScore }) => {
                const isActive = schema?.id === s.id
                const healthLabel = getHealthLabel(healthScore)

                return (
                    <div key={s.id} className={`card ${isActive ? "card-active" : ""}`} style={{ padding: 10 }}>
                        <div className="row-between" style={{ marginBottom: results.length > 0 ? 8 : 0 }}>
                            <div>
                                <span style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</span>
                                <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginLeft: 6 }}>
                                    {SCHEMA_TYPE_LABELS[s.type]}
                                </span>
                            </div>
                            <div className="row gap-6">
                                <span style={{ fontSize: 10, fontWeight: 700, color: healthLabel.color }}>
                                    {healthScore}/100
                                </span>
                                <span className={`badge badge-${summary.status}`}>
                                    {summary.status === "valid"
                                        ? "Valid"
                                        : summary.status === "warning"
                                          ? `${summary.warnings} warning${summary.warnings !== 1 ? "s" : ""}`
                                          : `${summary.errors} error${summary.errors !== 1 ? "s" : ""}`}
                                </span>
                            </div>
                        </div>

                        {/* Health progress bar */}
                        <div className="health-bar" style={{ marginBottom: results.length > 0 ? 8 : 0 }}>
                            <motion.div
                                className="health-bar-fill"
                                style={{ backgroundColor: healthLabel.color }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${healthScore}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>

                        {results.length > 0 && (
                            <div className="stack-sm">
                                {results.map((r, i) => (
                                    <div
                                        key={i}
                                        className={`validation-item validation-item-${r.level === "error" ? "fail" : r.level === "warning" ? "warn" : "info"}`}
                                    >
                                        <span className="validation-icon">
                                            {r.level === "error" ? "!" : r.level === "warning" ? "~" : "i"}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <span>{r.message}</span>
                                            {r.suggestion && (
                                                <div style={{ fontSize: 10, marginTop: 2, opacity: 0.8 }}>
                                                    Fix: {r.suggestion}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {results.length === 0 && (
                            <div className="validation-item validation-item-pass">
                                <span className="validation-icon">ok</span>
                                <span>All required and recommended fields are filled.</span>
                            </div>
                        )}
                    </div>
                )
            })}

            {/* Google Rich Results Test buttons */}
            <section className="stack">
                <h3>Test with Google</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                        className="framer-button-primary"
                        style={{ fontSize: 11, padding: "6px 14px" }}
                        onClick={() => {
                            window.open("https://search.google.com/test/rich-results", "_blank")
                        }}
                    >
                        Test JSON-LD (paste code)
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ fontSize: 11, padding: "6px 14px" }}
                        onClick={() => {
                            const url = prompt("Enter your page URL to test:")
                            if (url) {
                                window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`, "_blank")
                            }
                        }}
                    >
                        Test with Page URL
                    </button>
                    <a
                        href="https://validator.schema.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: 11, padding: "6px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                        Schema.org Validator
                    </a>
                </div>
            </section>

            {/* Legend */}
            <div className="stack-sm">
                <p style={{ fontSize: 10, fontWeight: 600 }}>Legend</p>
                <div className="row gap-10">
                    <span className="row gap-4" style={{ fontSize: 10 }}>
                        <span className="required-dot" /> Required
                    </span>
                    <span className="row gap-4" style={{ fontSize: 10 }}>
                        <span className="recommended-dot" /> Recommended
                    </span>
                    <span className="row gap-4" style={{ fontSize: 10 }}>
                        <span className="optional-dot" /> Optional
                    </span>
                </div>
            </div>
        </div>
    )
}
