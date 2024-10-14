import { AppSidebar } from "@/components/app-sidebar";
import ExploreNav from "@/components/explore-page/explore-nav";
import InsectCard from "@/components/explore-page/insect-card"; // Supondo que o componente está nesta localização

// A função de renderização do componente pode ser assíncrona para buscar dados no servidor
export default async function Home() {
  // Simulação de uma chamada ao banco de dados ou API
  const itemsFound = 702; // Substitua por uma chamada real ao seu banco de dados

  // Simulação de dados (pode vir de uma API futuramente)
  const insectData = [
    {
      order: "Coleoptera",
      family: "Coccinellidae",
      location: "Brasília, DF",
      date: "Set - 2024",
      collector: "Frizzas. M. R.",
      isFavorite: false,
    },
    {
      order: "Diptera",
      family: "Culicidae",
      location: "Manaus, AM",
      date: "Ago - 2023",
      collector: "Doe. J.",
      isFavorite: true,
    },
    // Adicione mais insetos conforme necessário
  ];

  return (
    <div className="flex h-screen w-full bg-bg">
      <div className="fixed inset-y-0 left-0 w-[13rem]">
        <AppSidebar />
      </div>

      <div className="ml-[13rem] flex-grow h-full p-2">
        <div className="h-full overflow-y-auto bg-white m-1 p-4 rounded-lg">
          {/* Passar o número de itens encontrados como prop para o ExploreNav */}
          <ExploreNav itemsFound={itemsFound} />

          {/* Renderização dos Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {insectData.map((insect, index) => (
              <InsectCard key={index} {...insect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
