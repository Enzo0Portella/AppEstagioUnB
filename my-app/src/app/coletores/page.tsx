"use client"

import { useState } from 'react';
import { useColetores } from '@/hooks/useColetores';
import { Coletor, ColetorFormData } from '@/types/coletor';
import { ColetorFormDialog } from '@/components/coletor-form-dialog';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ColetoresPage() {
  const { coletores, loading, error, createColetor, updateColetor, deleteColetor, fetchColetores } = useColetores();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentColetor, setCurrentColetor] = useState<Coletor | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formatar CPF para exibição (###.###.###-##)
  const formatCPFForDisplay = (cpf: string) => {
    if (!cpf || cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentColetor(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (coletor: Coletor) => {
    setIsEditing(true);
    setCurrentColetor(coletor);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    // Confirma com o usuário antes de excluir
    if (!confirm('Tem certeza que deseja excluir este coletor?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteColetor(id);
      
      // Verifica se o coletor ainda existe na lista após a exclusão
      const coletorAindaExiste = coletores.some(c => c.idColetor === id);
      
      if (!coletorAindaExiste) {
        alert('Coletor excluído com sucesso!');
      } else {
        // Se ainda existir, busca novamente para sincronizar
        await fetchColetores();
        alert('Operação concluída, mas é necessário verificar se o coletor foi realmente excluído.');
      }
    } catch (error) {
      console.error('Erro ao excluir coletor:', error);
      alert(`Erro ao excluir coletor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsDeleting(false);
      // Fecha o modal se estiver aberto durante a exclusão
      if (isFormOpen && currentColetor && currentColetor.idColetor === id) {
        setIsFormOpen(false);
      }
    }
  };

  const handleSubmit = async (data: ColetorFormData) => {
    setIsSubmitting(true);
    
    try {
      // Garante que o ID do coletor seja tratado corretamente
      const submissionData = {
        ...data,
        // Ao editar, mantenha o ID; ao criar, use 0 ou undefined
        idColetor: isEditing && currentColetor ? currentColetor.idColetor : 0
      };
      
      console.log('Dados para submissão:', submissionData);
      
      if (isEditing && currentColetor) {
        console.log('Editando coletor:', currentColetor.idColetor);
        const result = await updateColetor(submissionData as Coletor);
        console.log('Resultado da atualização:', result);
        alert("Coletor atualizado com sucesso!");
        await fetchColetores();
        setIsFormOpen(false);
      } else {
        console.log('Criando novo coletor');
        const result = await createColetor(submissionData);
        console.log('Resultado da criação:', result);
        alert("Coletor adicionado com sucesso!");
        await fetchColetores();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      
      // Tratamento específico para erros de validação ou outros erros conhecidos
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('400') || errorMessage.includes('422')) {
          alert('Dados inválidos. Verifique o CPF e o nome informados.');
        } else if (errorMessage.includes('409')) {
          alert('CPF já cadastrado. Utilize outro CPF.');
        } else {
          alert(`Erro ao salvar coletor: ${error.message}`);
        }
      } else {
        alert('Erro desconhecido ao salvar coletor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-800 mb-2">Gerenciamento de Coletores</h1>
            <p className="text-zinc-500 text-lg">Cadastre e gerencie todos os coletores do sistema</p>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleAddClick} 
                disabled={isSubmitting || isDeleting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Adicionar Coletor
              </Button>
            </div>
          </div>

          {(loading || isSubmitting || isDeleting) ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-zinc-700 font-medium">
                {loading ? 'Carregando coletores...' : 
                 isSubmitting ? 'Salvando coletor...' : 
                 'Excluindo coletor...'}
              </span>
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              </CardContent>
            </Card>
          ) : coletores.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-zinc-700">Nenhum coletor encontrado</CardTitle>
                <CardDescription className="text-zinc-500 mb-4">
                  Não existem coletores cadastrados no sistema. Adicione um novo coletor para começar.
                </CardDescription>
                <Button 
                  onClick={handleAddClick} 
                  disabled={isSubmitting}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Coletor
                </Button>
              </CardHeader>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-zinc-800">Coletores Registrados</CardTitle>
                    <CardDescription className="text-zinc-500 mt-1">
                      Total de {coletores.length} coletor{coletores.length !== 1 ? 'es' : ''} disponível{coletores.length !== 1 ? 'is' : ''} no sistema
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleAddClick} 
                    disabled={isSubmitting || isDeleting}
                    variant="outline"
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coletores.map((coletor) => (
                      <TableRow key={coletor.idColetor} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{coletor.idColetor}</TableCell>
                        <TableCell>{coletor.nomeColetor}</TableCell>
                        <TableCell>{formatCPFForDisplay(coletor.cpfColetor)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditClick(coletor)}
                              className="text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(coletor.idColetor)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <ColetorFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSubmit={handleSubmit}
            isEditing={isEditing}
            initialData={currentColetor}
            onDelete={currentColetor ? () => handleDeleteClick(currentColetor.idColetor) : undefined}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </SidebarProvider>
  );
} 