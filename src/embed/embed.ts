/**
 * Schema Rich Snippets - Embed script.
 * Injects JSON-LD structured data into the page <head>.
 *
 * Usage: Include this script on any page and it will find
 * elements with [data-schema-jsonld] attribute and inject
 * their content as JSON-LD script tags into the document head.
 *
 * Alternatively, the plugin generates static <script type="application/ld+json">
 * tags that can be pasted directly -- this embed script is for dynamic injection.
 */

(function () {
    function injectJsonLd(jsonString: string): void {
        try {
            // Validate JSON
            const parsed = JSON.parse(jsonString)
            if (!parsed) return

            // Check if already injected (avoid duplicates)
            const existing = document.querySelectorAll('script[type="application/ld+json"]')
            for (let i = 0; i < existing.length; i++) {
                try {
                    const existingData = JSON.parse(existing[i].textContent || "")
                    if (JSON.stringify(existingData) === JSON.stringify(parsed)) {
                        return // Already injected
                    }
                } catch {
                    // Ignore parse errors on existing scripts
                }
            }

            const script = document.createElement("script")
            script.type = "application/ld+json"
            script.textContent = JSON.stringify(parsed, null, 2)
            document.head.appendChild(script)
        } catch (e) {
            console.warn("[Schema Rich Snippets] Invalid JSON-LD:", e)
        }
    }

    function init(): void {
        // Method 1: Find elements with data-schema-jsonld attribute
        const elements = document.querySelectorAll("[data-schema-jsonld]")
        elements.forEach((el) => {
            const jsonString = el.getAttribute("data-schema-jsonld")
            if (jsonString) {
                injectJsonLd(jsonString)
            }
        })

        // Method 2: Find elements with data-schema-src attribute (URL to JSON-LD file)
        const srcElements = document.querySelectorAll("[data-schema-src]")
        srcElements.forEach((el) => {
            const src = el.getAttribute("data-schema-src")
            if (src) {
                fetch(src)
                    .then((res) => res.text())
                    .then((json) => injectJsonLd(json))
                    .catch((e) => console.warn("[Schema Rich Snippets] Failed to load:", src, e))
            }
        })

        // Method 3: Check for inline config in a hidden div
        const configEl = document.getElementById("schema-rich-snippets-config")
        if (configEl) {
            const jsonString = configEl.textContent || configEl.getAttribute("data-config")
            if (jsonString) {
                injectJsonLd(jsonString)
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init)
    } else {
        init()
    }
})()

// Export for testing
export function _testInjectJsonLd(jsonString: string): boolean {
    try {
        JSON.parse(jsonString)
        return true
    } catch {
        return false
    }
}
