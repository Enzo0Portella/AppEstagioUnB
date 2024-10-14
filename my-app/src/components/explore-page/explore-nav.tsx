import React from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react"; 

const ExploreNav = ({ itemsFound }: { itemsFound: number }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between pb-2">
      <span className="text-sm text-muted-foreground">
        {itemsFound} insetos encontrados
      </span>

      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </Button>
    </div>
  );
};

export default ExploreNav;
