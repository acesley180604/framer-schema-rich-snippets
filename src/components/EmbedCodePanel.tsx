import { useState } from "react"
import { useSchemaStore } from "@/store/schemaStore"
import { generateScriptTag, generateAllJsonLdString, copyToClipboard } from "@/utils/jsonld"

export default function EmbedCodePanel() {
    const { schemas } = useSchemaStore()
    const [copied, setCopied] = useState(false)
    const [mode, setMode] = useState<"script-tag" | "json-only">("script-tag")

    if (schemas.length === 0) {
        return (
            <div className="empty-state">
                <p>No schemas to embed. Add one from the Schemas tab first.</p>
            </div>
        )
    }

    const embedCode = mode === "script-tag"
        ? generateScriptTag(schemas)
        : generateAllJsonLdString(schemas)

    const handleCopy = async () => {
        const ok = await copyToClipboard(embedCode)
        if (ok) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Embed Code</h2>
                <p style={{ marginTop: 4 }}>
                    Add this structured data to your website for rich snippet results.
                </p>
            </section>

            {/* Mode selector */}
            <div className="segment-group">
                <button
                    onClick={() => setMode("script-tag")}
                    className={`segment-btn ${mode === "script-tag" ? "active" : ""}`}
                >
                    Script Tag (recommended)
                </button>
                <button
                    onClick={() => setMode("json-only")}
                    className={`segment-btn ${mode === "json-only" ? "active" : ""}`}
                >
                    JSON Only
                </button>
            </div>

            {/* Info box */}
            <div className="info-box info-box-default">
                {mode === "script-tag" ? (
                    <span>
                        The script tag wraps the JSON-LD in{" "}
                        <code>&lt;script type="application/ld+json"&gt;</code> ready to paste into your HTML.
                    </span>
                ) : (
                    <span>
                        Raw JSON-LD without the script wrapper. Use this if your CMS has a dedicated structured data field.
                    </span>
                )}
            </div>

            {/* Code block */}
            <div className="code-block">
                <button
                    onClick={handleCopy}
                    className={`copy-btn ${copied ? "copied" : ""}`}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
                {embedCode}
            </div>

            {/* Schema count */}
            <div className="info-box info-box-tint">
                Embedding {schemas.length} schema{schemas.length !== 1 ? "s" : ""} total.
            </div>

            {/* Installation instructions */}
            <div className="install-guide">
                <header>Installation Guide</header>
                <ol>
                    <li>Copy the embed code above</li>
                    <li>
                        In Framer: Go to Site Settings &rarr; Custom Code &rarr; End of{" "}
                        <code>&lt;head&gt;</code>
                    </li>
                    <li>Paste the code and publish your site</li>
                    <li>
                        Verify with the{" "}
                        <a
                            href="https://search.google.com/test/rich-results"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--framer-color-tint)" }}
                        >
                            Google Rich Results Test
                        </a>
                    </li>
                    <li>
                        For per-page schemas: Use the page-level Custom Code section in Framer
                    </li>
                </ol>
            </div>

            {/* Google test shortcut */}
            <button
                className="framer-button-primary w-full"
                onClick={() => {
                    const json = generateAllJsonLdString(schemas)
                    const encoded = encodeURIComponent(json)
                    window.open(`https://search.google.com/test/rich-results?code=${encoded}`, "_blank")
                }}
            >
                Test in Google Rich Results
            </button>
        </div>
    )
}
