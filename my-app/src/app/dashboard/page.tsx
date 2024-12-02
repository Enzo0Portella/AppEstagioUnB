"use client"
import { useState } from 'react';
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

const insectData = [
  {
    image: "",
    order: "Coleoptera",
    family: "Coccinellidae",
    location: "Brasília, DF",
    date: "Set - 2024",
    author: "Frizzas, M. R",
  },
  {
    image: "",
    order: "Lepidoptera",
    family: "Nymphalidae",
    location: "Rio de Janeiro, RJ",
    date: "Ago - 2023",
    author: "Silva, J. L",
  },
  {
    image: "",
    order: "Diptera",
    family: "Culicidae",
    location: "São Paulo, SP",
    date: "Jan - 2024",
    author: "Oliveira, A. C",
  },
  {
    image: "",
    order: "Diptera",
    family: "Culicidae",
    location: "São Paulo, SP",
    date: "Jan - 2024",
    author: "Oliveira, A. C",
  },
  {
    image: "",
    order: "Hymenoptera",
    family: "Apidae",
    location: "Curitiba, PR",
    date: "Mar - 2024",
    author: "Santos, R. P",
  },
  {
    image: "",
    order: "Coleoptera", 
    family: "Scarabaeidae",
    location: "Salvador, BA",
    date: "Fev - 2024",
    author: "Costa, M. A",
  },
  {
    image: "",
    order: "Lepidoptera",
    family: "Pieridae",
    location: "Manaus, AM", 
    date: "Abr - 2024",
    author: "Lima, F. S",
  },
  {
    image: "",
    order: "Orthoptera",
    family: "Acrididae",
    location: "Fortaleza, CE",
    date: "Mai - 2024", 
    author: "Pereira, D. M",
  },
  {
    image: "",
    order: "Hemiptera",
    family: "Pentatomidae",
    location: "Recife, PE",
    date: "Jun - 2024",
    author: "Ferreira, G. H",
  },
  {
    image: "",
    order: "Odonata",
    family: "Libellulidae",
    location: "Belém, PA",
    date: "Jul - 2024",
    author: "Carvalho, L. R",
  },
  {
    image: "",
    order: "Mantodea",
    family: "Mantidae",
    location: "Porto Alegre, RS",
    date: "Ago - 2024",
    author: "Rodrigues, T. S",
  },
  {
    image: "",
    order: "Neuroptera",
    family: "Chrysopidae",
    location: "Goiânia, GO",
    date: "Set - 2024",
    author: "Almeida, B. C",
  },
  {
    image: "",
    order: "Blattodea",
    family: "Blattidae",
    location: "Natal, RN",
    date: "Out - 2024",
    author: "Barbosa, H. L",
  },
  {
    image: "",
    order: "Dermaptera",
    family: "Forficulidae",
    location: "Vitória, ES",
    date: "Nov - 2024",
    author: "Martins, I. F",
  },
  {
    image: "",
    order: "Isoptera",
    family: "Termitidae",
    location: "Campo Grande, MS",
    date: "Dez - 2024",
    author: "Sousa, K. P",
  },
  {
    image: "",
    order: "Phasmatodea",
    family: "Phasmatidae",
    location: "João Pessoa, PB",
    date: "Jan - 2025",
    author: "Ribeiro, N. M",
  },
  {
    image: "",
    order: "Thysanoptera",
    family: "Thripidae",
    location: "Teresina, PI",
    date: "Fev - 2025",
    author: "Gomes, O. L",
  },
  {
    image: "",
    order: "Coleoptera",
    family: "Carabidae",
    location: "Florianópolis, SC",
    date: "Mar - 2025",
    author: "Pinto, Q. R",
  },
  // Adicione mais objetos conforme necessário
];

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Adaptar os dados para o formato esperado pelo InsectList
  const insectsForList = insectData.map(insect => ({
    order: insect.order,
    family: insect.family,
    location: insect.location,
    date: insect.date,
    collector: insect.author,
    isFavorite: false // você pode adicionar esta propriedade nos seus dados originais
  }));

  return (
    <SidebarProvider>
      <AppSidebar insectData={insectData} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {insectData.length} insetos encontrados
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 auto-rows-min md:grid-cols-2 lg:grid-cols-3">
              {insectData.map((insect, i) => (
                <CardInsect
                  key={i}
                  image={insect.image}
                  order={insect.order}
                  family={insect.family}
                  location={insect.location}
                  date={insect.date}
                  author={insect.author}
                />
              ))}
            </div>
          ) : (
            <InsectList insects={insectsForList} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
