import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tab = 'all' | 'favorites' | 'archived'
type SortBy = 'newest' | 'oldest' | 'title' | 'updated'

interface StoreState {
  searchQuery: string
  activeTab: Tab
  isSidebarOpen: boolean
  sortBy: SortBy
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: Tab) => void
  toggleSidebar: () => void
  setSortBy: (sortBy: SortBy) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchQuery: '',
      activeTab: 'all',
      isSidebarOpen: true,
      sortBy: 'newest',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: 'note-app-storage',
    }
  )
) 