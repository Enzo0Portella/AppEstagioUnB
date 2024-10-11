import Link from "next/link"
import { MoreHorizontal, PlusSquare, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavProjects({
  projects,
  className,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentProps<"ul">) {
  return (
    <ul className={cn("grid gap-0.5", className)}>
      {projects.map((item) => (
        <li
          key={item.name}
          className="has-[[data-state=open]]:bg-accent has-[[data-state=open]]:text-accent-foreground group relative rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          <Link
            href={item.url}
            className="flex h-9 items-center gap-3 overflow-hidden rounded-md px-1.5 text-xs outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
          >
            <item.icon className="h-5 w-5 shrink-0 translate-x-0.5 text-foreground" />
            <div className="line-clamp-1 grow overflow-hidden pr-6 font-medium">
              {item.name}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
