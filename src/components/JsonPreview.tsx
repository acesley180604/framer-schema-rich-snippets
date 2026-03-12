import { useState } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { generateJsonLdString, generateAllJsonLdString, copyToClipboard } from "@/utils/jsonld"

export default function JsonPreview() {
    const { activeSchema, schemas } = useSchemaStore()
    const schema = activeSchema()
    const [viewMode, setViewMode] = useState<"single" | "all">("single")
    const [copied, setCopied] = useState(false)

    const jsonOutput = viewMode === "single" && schema
        ? generateJsonLdString(schema)
        : generateAllJsonLdString(schemas)

    const handleCopy = async () => {
        const ok = await copyToClipboard(jsonOutput)
        if (ok) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to preview. Add one from the Schemas tab.</p>
            </div>
        )
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>JSON-LD Preview</h2>
                <p style={{ marginTop: 4 }}>
                    Live preview of the generated structured data markup.
                </p>
            </section>

            {/* View mode selector */}
            <div className="segment-group">
                <button
                    onClick={() => setViewMode("single")}
                    className={`segment-btn ${viewMode === "single" ? "active" : ""}`}
                    disabled={!schema}
                >
                    Active Schema
                </button>
                <button
                    onClick={() => setViewMode("all")}
                    className={`segment-btn ${viewMode === "all" ? "active" : ""}`}
                >
                    All Schemas ({schemas.length})
                </button>
            </div>

            {viewMode === "single" && !schema && (
                <div className="info-box info-box-warn">
                    No schema selected. Switch to "All Schemas" view or select a schema from the Schemas tab.
                </div>
            )}

            {/* JSON output */}
            {jsonOutput && (
                <div className="code-block">
                    <button
                        onClick={handleCopy}
                        className={`copy-btn ${copied ? "copied" : ""}`}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    {jsonOutput}
                </div>
            )}

            {/* Info */}
            <div className="info-box info-box-default">
                This is the raw JSON-LD that will be injected into your page. You can paste it into the{" "}
                <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--framer-color-tint)" }}
                >
                    Google Rich Results Test
                </a>
                {" "}to verify it.
            </div>
        </div>
    )
}
