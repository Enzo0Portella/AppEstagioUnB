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
  // Adicione mais objetos conforme necessário
];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
