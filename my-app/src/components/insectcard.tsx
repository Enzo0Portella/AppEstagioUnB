"use client";

import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholderImage from "@/assets/img-placeholder.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, User } from "lucide-react";

interface CardInsectProps {
  nome: string
  ordem: string
  familia: string
  location: string
  date: string
  author: string
  onClick?: () => void
}

export default function CardInsect({
  nome,
  ordem,
  familia,
  location,
  date,
  author,
  onClick
}: CardInsectProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
        <CardDescription>{ordem} - {familia}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
