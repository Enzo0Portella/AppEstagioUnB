"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavMainItemProps {
  title: string
  url?: string
  icon: any
  isActive?: boolean
  badge?: string
  onClick?: () => void
}

export function NavMain({
  items,
}: {
  items: NavMainItemProps[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.onClick ? (
            <SidebarMenuButton onClick={item.onClick}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild>
              <a href={item.url || "#"}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
