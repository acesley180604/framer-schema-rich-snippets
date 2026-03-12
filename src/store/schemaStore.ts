import { create } from "zustand"
import type { SchemaType, SchemaEntry, PageEntry } from "@/schemas/types"

function generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

function getDefaultData(type: SchemaType): Record<string, unknown> {
    switch (type) {
        case "FAQPage":
            return { faqItems: [{ question: "", answer: "" }] }
        case "HowTo":
            return { steps: [{ name: "", text: "" }], supply: [], tool: [] }
        case "BreadcrumbList":
            return { breadcrumbs: [{ name: "", url: "" }] }
        case "Recipe":
            return { recipeIngredient: [""], recipeInstructions: [{ name: "", text: "" }] }
        case "Organization":
        case "Person":
            return { sameAs: [] }
        case "ItemList":
            return { listItems: [{ name: "", url: "" }] }
        case "JobPosting":
            return { skills: [] }
        case "Movie":
            return { actorNames: [] }
        case "MusicAlbum":
            return { trackNames: [] }
        case "Dataset":
            return { keywords: [] }
        default:
            return {}
    }
}

interface SchemaStore {
    schemas: SchemaEntry[]
    activeSchemaId: string | null
    pages: PageEntry[]
    activePageId: string | null
    customJson: string
    toast: { message: string; type: "error" | "success" | "info" } | null

    // Schema actions
    addSchema: (type: SchemaType) => void
    removeSchema: (id: string) => void
    duplicateSchema: (id: string) => void
    selectSchema: (id: string | null) => void
    updateSchemaData: (id: string, data: Record<string, unknown>) => void
    updateSchemaName: (id: string, name: string) => void
    applyTemplate: (type: SchemaType, data: Record<string, unknown>, name: string) => void
    importCustomSchema: (type: SchemaType, data: Record<string, unknown>, name: string) => void
    clearAll: () => void

    // Page actions
    addPage: (name: string, url: string) => void
    removePage: (id: string) => void
    updatePage: (id: string, name: string, url: string) => void
    selectPage: (id: string | null) => void
    assignSchemaToPage: (schemaId: string, pageId: string) => void
    removeSchemaFromPage: (schemaId: string, pageId: string) => void

    // Custom JSON
    setCustomJson: (json: string) => void

    // Toast
    showToast: (message: string, type: "error" | "success" | "info") => void
    clearToast: () => void

    // Selectors
    activeSchema: () => SchemaEntry | undefined
    schemasForPage: (pageId: string) => SchemaEntry[]
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
    schemas: [],
    activeSchemaId: null,
    pages: [],
    activePageId: null,
    customJson: "",
    toast: null,

    addSchema: (type) => {
        const id = generateId()
        const entry: SchemaEntry = {
            id,
            type,
            name: type,
            data: getDefaultData(type),
            createdAt: Date.now(),
        }
        set((state) => ({
            schemas: [...state.schemas, entry],
            activeSchemaId: id,
        }))
    },

    removeSchema: (id) => {
        set((state) => ({
            schemas: state.schemas.filter((s) => s.id !== id),
            activeSchemaId: state.activeSchemaId === id ? null : state.activeSchemaId,
            pages: state.pages.map((p) => ({
                ...p,
                schemaIds: p.schemaIds.filter((sid) => sid !== id),
            })),
        }))
    },

    duplicateSchema: (id) => {
        const source = get().schemas.find((s) => s.id === id)
        if (!source) return
        const newId = generateId()
        const duplicate: SchemaEntry = {
            ...source,
            id: newId,
            name: `${source.name} (copy)`,
            data: JSON.parse(JSON.stringify(source.data)),
            createdAt: Date.now(),
        }
        set((state) => ({
            schemas: [...state.schemas, duplicate],
            activeSchemaId: newId,
        }))
    },

    selectSchema: (id) => {
        set({ activeSchemaId: id })
    },

    updateSchemaData: (id, data) => {
        set((state) => ({
            schemas: state.schemas.map((s) =>
                s.id === id ? { ...s, data: { ...s.data, ...data } } : s
            ),
        }))
    },

    updateSchemaName: (id, name) => {
        set((state) => ({
            schemas: state.schemas.map((s) =>
                s.id === id ? { ...s, name } : s
            ),
        }))
    },

    applyTemplate: (type, data, name) => {
        const id = generateId()
        const entry: SchemaEntry = {
            id,
            type,
            name,
            data: JSON.parse(JSON.stringify(data)),
            createdAt: Date.now(),
        }
        set((state) => ({
            schemas: [...state.schemas, entry],
            activeSchemaId: id,
        }))
    },

    importCustomSchema: (type, data, name) => {
        const id = generateId()
        const entry: SchemaEntry = {
            id,
            type,
            name,
            data: JSON.parse(JSON.stringify(data)),
            createdAt: Date.now(),
        }
        set((state) => ({
            schemas: [...state.schemas, entry],
            activeSchemaId: id,
        }))
    },

    clearAll: () => {
        set({ schemas: [], activeSchemaId: null, pages: [], activePageId: null })
    },

    // Page actions
    addPage: (name, url) => {
        const id = generateId()
        const page: PageEntry = { id, name, url, schemaIds: [] }
        set((state) => ({
            pages: [...state.pages, page],
            activePageId: id,
        }))
    },

    removePage: (id) => {
        set((state) => ({
            pages: state.pages.filter((p) => p.id !== id),
            activePageId: state.activePageId === id ? null : state.activePageId,
        }))
    },

    updatePage: (id, name, url) => {
        set((state) => ({
            pages: state.pages.map((p) =>
                p.id === id ? { ...p, name, url } : p
            ),
        }))
    },

    selectPage: (id) => {
        set({ activePageId: id })
    },

    assignSchemaToPage: (schemaId, pageId) => {
        set((state) => ({
            pages: state.pages.map((p) =>
                p.id === pageId && !p.schemaIds.includes(schemaId)
                    ? { ...p, schemaIds: [...p.schemaIds, schemaId] }
                    : p
            ),
        }))
    },

    removeSchemaFromPage: (schemaId, pageId) => {
        set((state) => ({
            pages: state.pages.map((p) =>
                p.id === pageId
                    ? { ...p, schemaIds: p.schemaIds.filter((sid) => sid !== schemaId) }
                    : p
            ),
        }))
    },

    setCustomJson: (json) => {
        set({ customJson: json })
    },

    showToast: (message, type) => {
        set({ toast: { message, type } })
    },

    clearToast: () => {
        set({ toast: null })
    },

    activeSchema: () => {
        const state = get()
        return state.schemas.find((s) => s.id === state.activeSchemaId)
    },

    schemasForPage: (pageId) => {
        const state = get()
        const page = state.pages.find((p) => p.id === pageId)
        if (!page) return []
        return state.schemas.filter((s) => page.schemaIds.includes(s.id))
    },
}))
