import { Database } from "lucide-react"
import { Badge } from "./ui/badge"

import { Card, CardContent } from "@/components/ui/card"

export function StorageCard() {
  return (
    <Card className="rounded-md text-xs shadow-sm">
      <CardContent className="flex items-start gap-2.5 p-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Database className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="grid flex-1 gap-1">
          <p className="font-medium">Running out of space?</p>
          <p className="text-muted-foreground">79.2 GB / 100 GB used</p>
        </div>
      </CardContent>
    </Card>
  )
}
