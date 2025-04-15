import React from "react"
import { Badge } from "@/components/ui/badge"
import { Bookmark } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type InsectListProps = {
  items: {
    order: string
    family: string
    location: string
    date: string
    collector: string
    isFavorite: boolean
  }[]
}

const InsectList: React.FC<InsectListProps> = ({ items }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Família</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Coletor</TableHead>
            <TableHead className="w-[50px]">Favorito</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((insect, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{insect.order}</TableCell>
              <TableCell>{insect.family}</TableCell>
              <TableCell>
                <Badge variant="outline">{insect.location}</Badge>
              </TableCell>
              <TableCell>{insect.date}</TableCell>
              <TableCell>{insect.collector}</TableCell>
              <TableCell>
                <Bookmark
                  className="h-4 w-4"
                  fill={insect.isFavorite ? "red" : "none"}
                  stroke={insect.isFavorite ? "red" : "currentColor"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default InsectList 