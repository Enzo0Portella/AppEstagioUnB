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
import { Button } from "@/components/ui/button";
import { InsectFormData } from '@/types/insect';
import { useInsects } from '@/hooks/useInsects';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const {
    insects,
    isLoading,
    error,
    selectedInsect,
    setSelectedInsect,
    fetchInsects,
    addInsect,
    editInsect,
    removeInsect
  } = useInsects();

  useEffect(() => {
    fetchInsects();
  }, [fetchInsects]);

  const handleSubmit = async (formData: InsectFormData) => {
    if (formData.id) {
      // Editar inseto existente
      const result = await editInsect(formData);
      if (result) {
        setSelectedInsect(null);
        console.log('Inseto atualizado com sucesso:', result);
      }
    } else {
      // Criar novo inseto
      const result = await addInsect(formData);
      if (result) {
        setSelectedInsect(null);
        console.log('Inseto criado com sucesso:', result);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedInsect?.id) return;
    
    const success = await removeInsect(selectedInsect.id);
    if (success) {
      setSelectedInsect(null);
      console.log('Inseto excluído com sucesso');
    }
  };

  const insectsForList = insects.map(insect => ({
    order: insect.ordem,
    family: insect.familia,
    location: insect.localColeta,
    date: new Date(insect.dataColeta).toLocaleDateString(),
    collector: insect.nomeColetor,
    isFavorite: false
  }));

  if (isLoading && insects.length === 0) {
    return <div>Carregando...</div>;
  }

  if (error && insects.length === 0) {
    return <div>Erro ao carregar insetos: {error}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar insectData={insects} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {insects.length} insetos encontrados
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3 flex items-center gap-2">
            <NavActions 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onNewInsect={fetchInsects}
            />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {insects.map((insect) => (
                <CardInsect 
                  key={insect.id}
                  insect={insect}
                  onClick={() => setSelectedInsect(insect)}
                />
              ))}
            </div>
          ) : (
            <InsectList items={insectsForList} />
          )}
        </main>
      </SidebarInset>

      <InsectFormDialog
        open={selectedInsect !== null}
        onOpenChange={(open) => !open && setSelectedInsect(null)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEditing={!!selectedInsect?.id}
        initialData={selectedInsect ? {
          ...selectedInsect,
          dataColeta: new Date(selectedInsect.dataColeta)
        } : undefined}
      />
    </SidebarProvider>
  );
}
