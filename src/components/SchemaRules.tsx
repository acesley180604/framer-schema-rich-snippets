import { useState, useCallback } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"

export default function SchemaRules() {
    const {
        rules,
        schemas,
        addRule,
        removeRule,
        updateRule,
        assignSchemaToRule,
        removeSchemaFromRule,
        schemasForRule,
        showToast,
    } = useSchemaStore()

    const [newName, setNewName] = useState("")
    const [newPattern, setNewPattern] = useState("")

    const handleAddRule = useCallback(() => {
        if (!newName.trim() || !newPattern.trim()) {
            showToast("Please enter a name and URL pattern", "error")
            return
        }
        addRule(newName.trim(), newPattern.trim())
        setNewName("")
        setNewPattern("")
        showToast("Rule created", "success")
    }, [newName, newPattern, addRule, showToast])

    const handleDeleteRule = useCallback(
        (id: string) => {
            if (window.confirm("Delete this rule?")) {
                removeRule(id)
                showToast("Rule deleted", "success")
            }
        },
        [removeRule, showToast]
    )

    return (
        <div className="stack-lg">
            <section>
                <h2>Sitewide Schema Rules</h2>
                <p style={{ marginTop: 4 }}>
                    Apply schema templates to multiple pages using URL patterns. Use wildcards like
                    <code style={{ fontSize: 11, padding: "1px 4px", background: "var(--framer-color-bg-secondary)", borderRadius: 3 }}>/blog/*</code>
                    to match groups of pages.
                </p>
            </section>

            {/* Add new rule */}
            <div className="card" style={{ padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Create Rule</div>
                <div className="stack-sm">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Rule name (e.g., Blog Posts)"
                    />
                    <input
                        type="text"
                        value={newPattern}
                        onChange={(e) => setNewPattern(e.target.value)}
                        placeholder="URL pattern (e.g., /blog/*)"
                    />
                    <button
                        className="framer-button-primary"
                        onClick={handleAddRule}
                        style={{ fontSize: 11, padding: "6px 14px" }}
                    >
                        Add Rule
                    </button>
                </div>
            </div>

            <div className="info-box info-box-default" style={{ fontSize: 10 }}>
                <strong>URL Pattern Syntax:</strong>
                <ul style={{ margin: "4px 0 0 16px", padding: 0, lineHeight: 1.8 }}>
                    <li><code>/blog/*</code> - matches all pages under /blog/</li>
                    <li><code>/products/*/reviews</code> - matches any product review page</li>
                    <li><code>*</code> - matches all pages</li>
                </ul>
                In the embed script, the current URL is matched against these patterns to determine which schemas to inject.
            </div>

            {/* Rules list */}
            {rules.length === 0 ? (
                <div className="empty-state">
                    <p>No rules yet. Create one above to apply schemas across multiple pages.</p>
                </div>
            ) : (
                <div className="stack">
                    {rules.map((rule) => {
                        const ruleSchemas = schemasForRule(rule.id)
                        return (
                            <div key={rule.id} className="card" style={{ padding: 10 }}>
                                <div className="row-between" style={{ marginBottom: 8 }}>
                                    <div>
                                        <span style={{ fontSize: 12, fontWeight: 600 }}>{rule.name}</span>
                                        <div style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginTop: 2 }}>
                                            Pattern: <code style={{ fontSize: 10 }}>{rule.urlPattern}</code>
                                        </div>
                                    </div>
                                    <div className="row gap-4">
                                        <label className="checkbox-label" style={{ margin: 0, fontSize: 10 }}>
                                            <input
                                                type="checkbox"
                                                checked={rule.enabled}
                                                onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                                            />
                                            Active
                                        </label>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDeleteRule(rule.id)}
                                            style={{ fontSize: 10 }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Edit pattern */}
                                <div className="grid-2" style={{ gap: 8, marginBottom: 8 }}>
                                    <div>
                                        <label style={{ fontSize: 10 }}>Name</label>
                                        <input
                                            type="text"
                                            value={rule.name}
                                            onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                                            style={{ fontSize: 11 }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10 }}>URL Pattern</label>
                                        <input
                                            type="text"
                                            value={rule.urlPattern}
                                            onChange={(e) => updateRule(rule.id, { urlPattern: e.target.value })}
                                            style={{ fontSize: 11 }}
                                        />
                                    </div>
                                </div>

                                {/* Assigned schemas */}
                                <div>
                                    <label style={{ fontSize: 10, marginBottom: 4 }}>Assigned Schemas ({ruleSchemas.length})</label>
                                    {ruleSchemas.length > 0 && (
                                        <div className="stack-sm" style={{ marginBottom: 6 }}>
                                            {ruleSchemas.map((s) => (
                                                <div key={s.id} className="row-between" style={{ fontSize: 10 }}>
                                                    <span>
                                                        {s.name}{" "}
                                                        <span style={{ color: "var(--framer-color-text-tertiary)" }}>
                                                            ({SCHEMA_TYPE_LABELS[s.type]})
                                                        </span>
                                                    </span>
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => removeSchemaFromRule(s.id, rule.id)}
                                                        style={{ fontSize: 9 }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {schemas.length > 0 && (
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    assignSchemaToRule(e.target.value, rule.id)
                                                    showToast("Schema assigned to rule", "success")
                                                }
                                            }}
                                            style={{ fontSize: 10 }}
                                        >
                                            <option value="">+ Assign schema...</option>
                                            {schemas
                                                .filter((s) => !rule.schemaIds.includes(s.id))
                                                .map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name} ({SCHEMA_TYPE_LABELS[s.type]})
                                                    </option>
                                                ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
