import type { Id } from "@convex/_generated/dataModel"
import { Store, useStore } from "@tanstack/react-store"

export const profileStore = new Store({
  selectedId: null as Id<"profiles"> | null,
})

export const useSelectedProfileId = () =>
  useStore(profileStore, (s) => s.selectedId)

export const setSelectedProfile = (id: Id<"profiles"> | null) =>
  profileStore.setState((s) => ({ ...s, selectedId: id }))
