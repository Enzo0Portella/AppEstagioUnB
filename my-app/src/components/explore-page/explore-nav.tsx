import React from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, LayoutDashboard } from "lucide-react"; 
import Link from "next/link";

const ExploreNav = ({ itemsFound }: { itemsFound: number }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between pb-2">
      <span className="text-sm text-muted-foreground">
        {itemsFound} insetos encontrados
      </span>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ExploreNav;