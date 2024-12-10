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

interface Insect {
  id: number
  nome: string
  localColeta: string
  dataColeta: string
  nomeColetor: string
  tag: string
  familia: string
  genero: string
  ordem: string
}

export default function DashboardPage() {
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

  const handleSubmit = async (formData: Insect) => {
    try {
      const payload = {
        ...formData,
        id: null,
        dataColeta: formData.dataColeta
      };

      console.log('Payload final:', payload);

      const response = await fetch('http://localhost:8080/api/insetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao salvar: ${errorText}`);
      }

      const savedInsect = await response.json();
      console.log('Inseto salvo com sucesso:', savedInsect);
      
      fetchInsects();
      setSelectedInsect(null);
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert('Erro ao salvar o inseto. Verifique o console para mais detalhes.');
    }
  };

  const handleDelete = async () => {
    if (!selectedInsect?.id) return;
    
    try {
      await fetch(`http://localhost:8080/api/insetos/${selectedInsect.id}`, {
        method: 'DELETE',
      });
      fetchInsects();
      setSelectedInsect(null);
    } catch (error) {
      console.error('Erro ao excluir inseto:', error);
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

  if (isLoading) {
    return <div>Carregando...</div>;
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 auto-rows-min md:grid-cols-2 lg:grid-cols-3">
              {insects.map((insect) => (
                <CardInsect
                  key={insect.id}
                  nome={insect.nome}
                  ordem={insect.ordem}
                  familia={insect.familia}
                  location={insect.localColeta}
                  date={new Date(insect.dataColeta).toLocaleDateString()}
                  author={insect.nomeColetor}
                  onClick={() => setSelectedInsect(insect)}
                />
              ))}
            </div>
          ) : (
            <InsectList 
              insects={insectsForList}
              onSelect={(index: number) => setSelectedInsect(insects[index])}
            />
          )}
        </div>
      </SidebarInset>
      <InsectFormDialog
        open={selectedInsect !== null}
        onOpenChange={(open) => !open && setSelectedInsect(null)}
        onSubmit={async (data: InsectFormData) => {
          if (!data.dataColeta) {
            alert('Por favor, selecione uma data');
            return;
          }

          const insect: Insect = {
            nome: data.nome,
            localColeta: data.localColeta,
            dataColeta: data.dataColeta.toISOString().split('T')[0],
            nomeColetor: data.nomeColetor,
            tag: data.tag,
            familia: data.familia,
            genero: data.genero,
            ordem: data.ordem,
            id: 0
          };

          console.log('Dados sendo enviados:', insect);

          try {
            await handleSubmit(insect);
          } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao salvar o inseto');
          }
        }}
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
