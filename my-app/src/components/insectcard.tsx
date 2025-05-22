"use client";

import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholderImage from "@/assets/img-placeholder.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, User } from "lucide-react";
import { Insect } from "@/types/insect";
import NextImage from "next/image";
import { useColetores } from "@/hooks/useColetores";

interface CardInsectProps {
  insect: Insect
  onClick?: () => void
}

export default function CardInsect({
  insect,
  onClick
}: CardInsectProps) {
  const { coletores } = useColetores();
  const nomeColetor = coletores.find(c => c.idColetor === insect.idColetor)?.nomeColetor || 'Não informado';
  return (
    <Card className="cursor-pointer overflow-hidden flex flex-col" onClick={onClick}>
      <div className="relative h-40 w-full">
        <NextImage
          src={insect.imagemUrl || placeholderImage.src}
          alt={`Imagem de ${insect.nome}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage.src;
          }}
        />
      </div>
      <CardHeader>
        <CardTitle>{insect.nome}</CardTitle>
        <CardDescription>{insect.ordem} - {insect.familia}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{insect.localColeta}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(insect.dataColeta).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{nomeColetor}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 pb-1">
        <Badge variant="outline" className="text-xs">
          ID: {insect.id}
        </Badge>
      </CardFooter>
    </Card>
  )
}
