import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useSchemaStore } from "./store/schemaStore"
import SchemaList from "./components/SchemaList"
import SchemaEditor from "./components/SchemaEditor"
import JsonPreview from "./components/JsonPreview"
import Validator from "./components/Validator"
import TemplateGallery from "./components/TemplateGallery"
import EmbedCodePanel from "./components/EmbedCodePanel"
import CustomSchemaBuilder from "./components/CustomSchemaBuilder"
import SchemaGraph from "./components/SchemaGraph"
import RichResultPreview from "./components/RichResultPreview"
import SchemaRules from "./components/SchemaRules"
import Toast from "./components/Toast"

type Tab =
    | "schemas"
    | "editor"
    | "preview"
    | "validate"
    | "templates"
    | "embed"
    | "custom"
    | "graph"
    | "rich-preview"
    | "rules"

const TABS: { id: Tab; label: string }[] = [
    { id: "schemas", label: "Schemas" },
    { id: "editor", label: "Editor" },
    { id: "preview", label: "JSON" },
    { id: "validate", label: "Validate" },
    { id: "rules", label: "Rules" },
    { id: "templates", label: "Templates" },
    { id: "custom", label: "Custom" },
    { id: "graph", label: "Graph" },
    { id: "rich-preview", label: "Rich Preview" },
    { id: "embed", label: "Embed" },
]

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("schemas")
    const { activeSchemaId, activeSchema, toast, clearToast } = useSchemaStore()

    const schema = activeSchema()

    const handleTabChange = useCallback(
        (tab: Tab) => {
            if ((tab === "editor" || tab === "preview" || tab === "validate" || tab === "rich-preview") && !activeSchemaId && tab !== "validate") {
                setActiveTab("schemas")
                return
            }
            setActiveTab(tab)
        },
        [activeSchemaId]
    )

    return (
        <section>
            <header className="row-between" style={{ padding: "10px 15px", borderBottom: "1px solid var(--framer-color-divider)" }}>
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === "schemas" && <SchemaList onEditSchema={() => setActiveTab("editor")} />}
                        {activeTab === "editor" && <SchemaEditor />}
                        {activeTab === "preview" && <JsonPreview />}
                        {activeTab === "validate" && <Validator />}
                        {activeTab === "templates" && <TemplateGallery onApplied={() => setActiveTab("editor")} />}
                        {activeTab === "embed" && <EmbedCodePanel />}
                        {activeTab === "custom" && <CustomSchemaBuilder onImported={() => setActiveTab("editor")} />}
                        {activeTab === "rules" && <SchemaRules />}
                        {activeTab === "graph" && <SchemaGraph />}
                        {activeTab === "rich-preview" && <RichResultPreview />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
        </section>
    )
}
