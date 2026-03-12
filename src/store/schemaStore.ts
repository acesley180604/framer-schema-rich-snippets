import { create } from "zustand"
import type { SchemaType, SchemaEntry } from "@/schemas/types"

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
        default:
            return {}
    }
}

interface SchemaStore {
    schemas: SchemaEntry[]
    activeSchemaId: string | null
    toast: { message: string; type: "error" | "success" | "info" } | null

    // Actions
    addSchema: (type: SchemaType) => void
    removeSchema: (id: string) => void
    duplicateSchema: (id: string) => void
    selectSchema: (id: string | null) => void
    updateSchemaData: (id: string, data: Record<string, unknown>) => void
    updateSchemaName: (id: string, name: string) => void
    applyTemplate: (type: SchemaType, data: Record<string, unknown>, name: string) => void
    clearAll: () => void
    showToast: (message: string, type: "error" | "success" | "info") => void
    clearToast: () => void

    // Selectors
    activeSchema: () => SchemaEntry | undefined
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
    schemas: [],
    activeSchemaId: null,
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

    clearAll: () => {
        set({ schemas: [], activeSchemaId: null })
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
}))
