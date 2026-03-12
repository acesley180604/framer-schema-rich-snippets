import { useSchemaStore } from "@/store/schemaStore"
import { validateSchema, getValidationSummary } from "@/schemas/validator"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"

export default function Validator() {
    const { activeSchema, schemas } = useSchemaStore()
    const schema = activeSchema()

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to validate. Add one from the Schemas tab.</p>
            </div>
        )
    }

    // Validate all schemas
    const allResults = schemas.map((s) => ({
        schema: s,
        results: validateSchema(s.type, s.data),
        summary: getValidationSummary(validateSchema(s.type, s.data)),
    }))

    const totalErrors = allResults.reduce((sum, r) => sum + r.summary.errors, 0)
    const totalWarnings = allResults.reduce((sum, r) => sum + r.summary.warnings, 0)
    const allValid = totalErrors === 0 && totalWarnings === 0

    return (
        <div className="stack-lg">
            <section>
                <h2>Schema Validator</h2>
                <p style={{ marginTop: 4 }}>
                    Checks required and recommended fields for all schemas.
                </p>
            </section>

            {/* Overall summary */}
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
            {allResults.map(({ schema: s, results, summary }) => {
                const isActive = schema?.id === s.id
                return (
                    <div key={s.id} className={`card ${isActive ? "card-active" : ""}`} style={{ padding: 10 }}>
                        <div className="row-between" style={{ marginBottom: results.length > 0 ? 8 : 0 }}>
                            <div>
                                <span style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</span>
                                <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginLeft: 6 }}>
                                    {SCHEMA_TYPE_LABELS[s.type]}
                                </span>
                            </div>
                            <span className={`badge badge-${summary.status}`}>
                                {summary.status === "valid"
                                    ? "Valid"
                                    : summary.status === "warning"
                                      ? `${summary.warnings} warning${summary.warnings !== 1 ? "s" : ""}`
                                      : `${summary.errors} error${summary.errors !== 1 ? "s" : ""}`}
                            </span>
                        </div>

                        {results.length > 0 && (
                            <div className="stack-sm">
                                {results.map((r, i) => (
                                    <div
                                        key={i}
                                        className={`validation-item validation-item-${r.level === "error" ? "fail" : "warn"}`}
                                    >
                                        <span className="validation-icon">
                                            {r.level === "error" ? "!" : "~"}
                                        </span>
                                        <span>{r.message}</span>
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

            {/* Google test link */}
            <div className="info-box info-box-tint">
                For a full validation, test your markup with the{" "}
                <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", fontWeight: 600 }}
                >
                    Google Rich Results Test
                </a>{" "}
                or{" "}
                <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", fontWeight: 600 }}
                >
                    Schema.org Validator
                </a>
                .
            </div>

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
                </div>
            </div>
        </div>
    )
}
