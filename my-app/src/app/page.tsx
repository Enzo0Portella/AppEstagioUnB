"use client"

import { useState, useEffect } from 'react';
import type { ViewMode } from "@/components/nav-actions";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CardInsect from "@/components/insectcard";
import InsectList from "@/components/explore-page/insect-list"
import { InsectFormDialog } from "@/components/insect-form-dialog";
import { type Insect } from "@/types/insect"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedInsect, setSelectedInsect] = useState<Insect | null>(null);
  const [insects, setInsects] = useState<Insect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInsects();
  }, []);

  const fetchInsects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/insetos');
      const data = await response.json();
      setInsects(data);
    } catch (error) {
      console.error('Erro ao buscar insetos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar insectData={insects} />
      <SidebarInset>
        {/* ... resto do JSX igual ao dashboard/page.tsx ... */}
      </SidebarInset>
    </SidebarProvider>
  );
}
