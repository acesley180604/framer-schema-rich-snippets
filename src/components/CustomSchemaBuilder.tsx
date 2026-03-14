import { useState, useCallback } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import type { SchemaType } from "@/schemas/types"
import { SCHEMA_TYPE_LABELS } from "@/schemas/types"

interface CustomSchemaBuilderProps {
    onImported: () => void
}

export default function CustomSchemaBuilder({ onImported }: CustomSchemaBuilderProps) {
    const { customJson, setCustomJson, importCustomSchema, showToast } = useSchemaStore()
    const [error, setError] = useState<string | null>(null)
    const [importUrl, setImportUrl] = useState("")

    const validateJson = useCallback((json: string): { valid: boolean; parsed?: Record<string, unknown> } => {
        if (!json.trim()) return { valid: false }
        try {
            const parsed = JSON.parse(json)
            if (typeof parsed !== "object" || parsed === null) {
                return { valid: false }
            }
            return { valid: true, parsed }
        } catch (e) {
            return { valid: false }
        }
    }, [])

    const handleJsonChange = useCallback(
        (value: string) => {
            setCustomJson(value)
            if (!value.trim()) {
                setError(null)
                return
            }
            const result = validateJson(value)
            if (result.valid) {
                setError(null)
            } else {
                try {
                    JSON.parse(value)
                    setError(null)
                } catch (e) {
                    setError((e as Error).message)
                }
            }
        },
        [setCustomJson, validateJson]
    )

    const handleImport = useCallback(() => {
        const result = validateJson(customJson)
        if (!result.valid || !result.parsed) {
            showToast("Invalid JSON. Please fix errors before importing.", "error")
            return
        }

        const parsed = result.parsed
        const type = (parsed["@type"] as SchemaType) || "Article"

        // Check if this is a known type
        const knownType = type in SCHEMA_TYPE_LABELS
        const schemaName = knownType
            ? `Custom ${SCHEMA_TYPE_LABELS[type as SchemaType]}`
            : `Custom Schema (${type})`

        // Extract useful data
        const data: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(parsed)) {
            if (key !== "@context" && key !== "@type") {
                data[key] = value
            }
        }

        const finalType: SchemaType = knownType ? (type as SchemaType) : "Article"
        importCustomSchema(finalType, data, schemaName)
        showToast("Custom schema imported successfully.", "success")
        setCustomJson("")
        onImported()
    }, [customJson, validateJson, importCustomSchema, showToast, setCustomJson, onImported])

    const handleImportFromUrl = useCallback(async () => {
        if (!importUrl.trim()) {
            showToast("Enter a URL to import from.", "error")
            return
        }

        try {
            showToast("Fetching page...", "info")
            const response = await fetch(importUrl.trim())
            const html = await response.text()

            // Try to extract JSON-LD from the page
            const jsonLdRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
            const matches: string[] = []
            let match: RegExpExecArray | null

            while ((match = jsonLdRegex.exec(html)) !== null) {
                matches.push(match[1].trim())
            }

            if (matches.length === 0) {
                showToast("No JSON-LD structured data found on that page.", "error")
                return
            }

            // Use the first match
            setCustomJson(matches[0])
            setError(null)
            showToast(`Found ${matches.length} JSON-LD block${matches.length !== 1 ? "s" : ""}. First one loaded.`, "success")
        } catch {
            showToast("Failed to fetch URL. Check the URL and try again.", "error")
        }
    }, [importUrl, showToast, setCustomJson])

    const handleFormat = useCallback(() => {
        try {
            const parsed = JSON.parse(customJson)
            setCustomJson(JSON.stringify(parsed, null, 2))
            setError(null)
        } catch {
            showToast("Cannot format invalid JSON.", "error")
        }
    }, [customJson, setCustomJson, showToast])

    const handleMinify = useCallback(() => {
        try {
            const parsed = JSON.parse(customJson)
            setCustomJson(JSON.stringify(parsed))
            setError(null)
        } catch {
            showToast("Cannot minify invalid JSON.", "error")
        }
    }, [customJson, setCustomJson, showToast])

    const isValid = customJson.trim() ? validateJson(customJson).valid : false
    const charCount = customJson.length

    return (
        <div className="stack-lg">
            <section>
                <h2>Custom Schema Builder</h2>
                <p style={{ marginTop: 4 }}>
                    Build any schema type with a free-form JSON editor. Import from URL or paste raw JSON-LD.
                </p>
            </section>

            {/* Import from URL */}
            <div className="card" style={{ padding: 10 }}>
                <h3 style={{ marginBottom: 6 }}>Import from URL</h3>
                <p style={{ marginBottom: 8, fontSize: 10 }}>
                    Paste a URL and extract existing JSON-LD structured data from the page.
                </p>
                <div className="row gap-4">
                    <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://example.com/page"
                        style={{ flex: 1 }}
                    />
                    <button className="framer-button-primary" onClick={() => void handleImportFromUrl()} style={{ padding: "6px 10px", fontSize: 11 }}>
                        Fetch
                    </button>
                </div>
            </div>

            {/* JSON Editor */}
            <div>
                <div className="row-between" style={{ marginBottom: 4 }}>
                    <label style={{ marginBottom: 0 }}>JSON-LD Editor</label>
                    <div className="row gap-4">
                        <button className="btn-secondary" onClick={handleFormat} style={{ padding: "3px 8px", fontSize: 10 }}>
                            Format
                        </button>
                        <button className="btn-secondary" onClick={handleMinify} style={{ padding: "3px 8px", fontSize: 10 }}>
                            Minify
                        </button>
                    </div>
                </div>
                <div className="json-editor-wrapper">
                    <textarea
                        value={customJson}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "My Article",
  "author": {
    "@type": "Person",
    "name": "John Doe"
  }
}`}
                        rows={14}
                        className="json-editor"
                        spellCheck={false}
                    />
                </div>

                {/* Status bar */}
                <div className="row-between" style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: error ? "#e53e3e" : isValid ? "#38a169" : "var(--framer-color-text-tertiary)" }}>
                        {error
                            ? `Error: ${error}`
                            : isValid
                              ? "Valid JSON"
                              : customJson.trim()
                                ? "Invalid JSON"
                                : "Paste JSON-LD here"}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                        {charCount} chars
                    </div>
                </div>
            </div>

            {/* Import button */}
            <button
                className="framer-button-primary w-full"
                onClick={handleImport}
                disabled={!isValid}
                style={{ opacity: isValid ? 1 : 0.5 }}
            >
                Import as Schema
            </button>

            {/* Info */}
            <div className="info-box info-box-default">
                <strong>Supported formats:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: 16, fontSize: 10, lineHeight: 1.6 }}>
                    <li>Standard JSON-LD with @context and @type</li>
                    <li>Any schema.org type (even those not in the type selector)</li>
                    <li>Nested objects and arrays</li>
                    <li>Multiple @graph items (first item will be imported)</li>
                </ul>
            </div>
        </div>
    )
}
