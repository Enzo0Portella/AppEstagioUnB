import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"; // Componente Badge do ShadCN
import { Bookmark } from "lucide-react"; // Ícone do Lucide

// Placeholder de imagem caso nenhuma seja fornecida
import placeholderImage from "@/assets/img-placeholder.png";

type InsectCardProps = {
  order: string;
  family: string;
  location: string;
  date: string;
  collector: string;
  image?: string;
  isFavorite: boolean;
};

const InsectCard: React.FC<InsectCardProps> = ({
  order,
  family,
  location,
  date,
  collector,
  image,
  isFavorite,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Imagem do inseto com fallback para placeholder */}
      <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
        <Image
          src={image || placeholderImage} // Se não houver imagem, usa o placeholder
          alt={`${order} ${family}`}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      {/* Informações do Inseto */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Ordem</p>
            <p className="text-base font-semibold">{order}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Família</p>
            <p className="text-base font-semibold">{family}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2 flex-wrap">
          {/* Badge para localização */}
          <Badge variant="outline">{location}</Badge>

          {/* Badge para data */}
          <Badge variant="outline">{date}</Badge>

          {/* Badge para o coletor */}
          <Badge variant="outline">{collector}</Badge>
        </div>

        {/* Ícone de Favorito */}
        <div className="mt-4 flex justify-end">
          <Bookmark
            className="h-6 w-6"
            fill={isFavorite ? "red" : "none"} // Mudança de cor e preenchimento condicional
            stroke={isFavorite ? "red" : "currentColor"}
          />
        </div>
      </div>
    </div>
  );
};

export default InsectCard;
