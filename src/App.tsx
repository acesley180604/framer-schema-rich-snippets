import { useState } from "react"
import { useSchemaStore } from "./store/schemaStore"
import SchemaList from "./components/SchemaList"
import SchemaEditor from "./components/SchemaEditor"
import JsonPreview from "./components/JsonPreview"
import Validator from "./components/Validator"
import TemplateGallery from "./components/TemplateGallery"
import EmbedCodePanel from "./components/EmbedCodePanel"
import Toast from "./components/Toast"

type Tab = "schemas" | "editor" | "preview" | "validate" | "templates" | "embed"

const TABS: { id: Tab; label: string }[] = [
    { id: "schemas", label: "Schemas" },
    { id: "editor", label: "Editor" },
    { id: "preview", label: "Preview" },
    { id: "validate", label: "Validate" },
    { id: "templates", label: "Templates" },
    { id: "embed", label: "Embed" },
]

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("schemas")
    const { activeSchemaId, activeSchema, toast, clearToast } = useSchemaStore()

    const schema = activeSchema()

    const handleTabChange = (tab: Tab) => {
        // If trying to go to editor/preview/validate without an active schema, redirect to schemas
        if ((tab === "editor" || tab === "preview" || tab === "validate") && !activeSchemaId) {
            setActiveTab("schemas")
            return
        }
        setActiveTab(tab)
    }

    return (
        <section>
            <header className="row-between" style={{ padding: "12px 15px", borderBottom: "1px solid var(--framer-color-divider)" }}>
                <div className="row gap-8">
                    <h1>Schema Rich Snippets</h1>
                    {schema && (
                        <span style={{ fontSize: 11, color: "var(--framer-color-text-secondary)" }}>
                            / {schema.name}
                        </span>
                    )}
                </div>
            </header>

            <nav className="tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={activeTab === tab.id ? "active" : ""}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main>
                {activeTab === "schemas" && <SchemaList onEditSchema={() => setActiveTab("editor")} />}
                {activeTab === "editor" && <SchemaEditor />}
                {activeTab === "preview" && <JsonPreview />}
                {activeTab === "validate" && <Validator />}
                {activeTab === "templates" && <TemplateGallery onApplied={() => setActiveTab("editor")} />}
                {activeTab === "embed" && <EmbedCodePanel />}
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
            <footer>Free plan: 3 schemas. Upgrade: Pro $9/mo (unlimited) | Agency $19/mo (white-label)</footer>
        </section>
    )
}
