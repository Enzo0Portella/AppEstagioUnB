"use client";

import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholderImage from "@/assets/img-placeholder.png";

const CardInsect = ({
  image,
  order,
  family,
  location,
  date,
  author,
}: {
  image?: string;
  order: string;
  family: string;
  location: string;
  date: string;
  author: string;
}) => {
  return (
    <div className="w-full h-auto rounded-lg p-2 flex flex-col gap-4 ">
      <div className="flex items-center justify-center h-48 md:h-60 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={image || placeholderImage.src}
          alt={`${order} - ${family}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <p className="text-sm text-gray-500">Ordem</p>
              <p className="font-bold">{order}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Família</p>
              <p className="font-bold">{family}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 data-[state=open]:bg-accent"
          >
            <Bookmark size={32} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{location}</Badge>
          <Badge variant="outline">{date}</Badge>
          <Badge variant="outline">{author}</Badge>
        </div>
      </div>
    </div>
  );
};

export default CardInsect;
