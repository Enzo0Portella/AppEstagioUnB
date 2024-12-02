"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import ExploreNav from "@/components/explore-page/explore-nav"
import InsectCard from "@/components/explore-page/insect-card"
import InsectList from "@/components/explore-page/insect-list"
import { NavActions, type ViewMode } from "@/components/nav-actions"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const itemsFound = 702

  const insectData = [
    {
      order: "Coleoptera",
      family: "Coccinellidae",
      location: "Brasília, DF",
      date: "Set - 2024",
      collector: "Frizzas. M. R.",
      isFavorite: false,
    },
    {
      order: "Diptera",
      family: "Culicidae",
      location: "Manaus, AM",
      date: "Ago - 2023",
      collector: "Doe. J.",
      isFavorite: true,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-bg">
        <div className="fixed inset-y-0 left-0 w-[13rem]">
          <AppSidebar />
        </div>

        <div className="ml-[13rem] flex-grow h-full p-2">
          <div className="h-full overflow-y-auto bg-white m-1 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <ExploreNav itemsFound={itemsFound} />
              <NavActions viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {insectData.map((insect, index) => (
                  <InsectCard key={index} {...insect} />
                ))}
              </div>
            ) : (
              <InsectList insects={insectData} />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
