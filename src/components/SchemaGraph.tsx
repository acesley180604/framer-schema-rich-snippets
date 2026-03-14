import { useMemo } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { SCHEMA_TYPE_LABELS, SCHEMA_TYPE_ICONS } from "@/schemas/types"
import { getSchemaConnections, generateJsonLd } from "@/utils/jsonld"

export default function SchemaGraph() {
    const { schemas } = useSchemaStore()

    const connections = useMemo(() => {
        return getSchemaConnections(schemas)
    }, [schemas])

    const nodeDetails = useMemo(() => {
        return schemas.map((entry) => {
            const jsonld = generateJsonLd(entry)
            const nestedTypes: string[] = []

            function findNestedTypes(obj: unknown, depth: number): void {
                if (depth > 3 || !obj || typeof obj !== "object") return
                if (Array.isArray(obj)) {
                    obj.forEach((item) => findNestedTypes(item, depth + 1))
                    return
                }
                const record = obj as Record<string, unknown>
                if (record["@type"] && typeof record["@type"] === "string") {
                    nestedTypes.push(record["@type"])
                }
                Object.values(record).forEach((val) => findNestedTypes(val, depth + 1))
            }

            findNestedTypes(jsonld, 0)

            // Remove the root type
            const rootType = jsonld["@type"] as string
            const children = nestedTypes.filter((t) => t !== rootType)

            return {
                entry,
                rootType,
                children: [...new Set(children)],
            }
        })
    }, [schemas])

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to visualize. Add some from the Schemas tab.</p>
            </div>
        )
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Schema Graph</h2>
                <p style={{ marginTop: 4 }}>
                    Visual representation of your schema relationships and nested types.
                </p>
            </section>

            {/* Connection summary */}
            {connections.length > 0 && (
                <div className="info-box info-box-tint">
                    <strong>{connections.length} connection{connections.length !== 1 ? "s" : ""} detected</strong>
                    <span> between your schemas.</span>
                </div>
            )}

            {connections.length === 0 && schemas.length > 1 && (
                <div className="info-box info-box-default">
                    No connections detected between schemas. Connections appear when schemas reference each other
                    (e.g., an Article&apos;s author matches a Person schema).
                </div>
            )}

            {/* Connections list */}
            {connections.length > 0 && (
                <div className="stack-sm">
                    <h3>Connections</h3>
                    {connections.map((conn, i) => {
                        const fromSchema = schemas.find((s) => s.id === conn.from)
                        const toSchema = schemas.find((s) => s.id === conn.to)
                        if (!fromSchema || !toSchema) return null

                        return (
                            <div key={i} className="card" style={{ padding: 8 }}>
                                <div className="row gap-8" style={{ fontSize: 11 }}>
                                    <div className="row gap-4">
                                        <div className="schema-icon" style={{ width: 24, height: 24, fontSize: 10 }}>
                                            {SCHEMA_TYPE_ICONS[fromSchema.type]}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{fromSchema.name}</span>
                                    </div>
                                    <span style={{ color: "var(--framer-color-tint)", fontSize: 10, fontWeight: 600 }}>
                                        --{conn.relationship}--&gt;
                                    </span>
                                    <div className="row gap-4">
                                        <div className="schema-icon" style={{ width: 24, height: 24, fontSize: 10 }}>
                                            {SCHEMA_TYPE_ICONS[toSchema.type]}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{toSchema.name}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Node detail view */}
            <div className="stack-sm">
                <h3>Schema Structure</h3>
                {nodeDetails.map(({ entry, rootType, children }) => (
                    <div key={entry.id} className="card" style={{ padding: 10 }}>
                        <div className="row gap-8" style={{ marginBottom: children.length > 0 ? 8 : 0 }}>
                            <div className="schema-icon">
                                {SCHEMA_TYPE_ICONS[entry.type]}
                            </div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 500 }}>{entry.name}</div>
                                <div style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginTop: 1 }}>
                                    @type: {rootType}
                                </div>
                            </div>
                        </div>

                        {children.length > 0 && (
                            <div className="graph-tree">
                                {children.map((childType, ci) => (
                                    <div key={ci} className="graph-tree-node">
                                        <div className="graph-tree-line" />
                                        <div className="graph-tree-label">
                                            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--framer-color-tint)" }}>
                                                {childType}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {children.length === 0 && (
                            <p style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)", marginTop: 4 }}>
                                No nested types in this schema.
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="info-box info-box-default">
                <strong>How connections work:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: 16, fontSize: 10, lineHeight: 1.6 }}>
                    <li>An Article with an author named "John" connects to a Person schema named "John"</li>
                    <li>An Article with a publisher named "Acme" connects to an Organization schema named "Acme"</li>
                    <li>A JobPosting hiring from "Acme" connects to an Organization named "Acme"</li>
                </ul>
            </div>
        </div>
    )
}
