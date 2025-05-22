"use client"

import * as React from "react";
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { type Insect } from "@/types/insect";
import { MapPin, Calendar, User, Copy, Pencil } from "lucide-react";
import placeholderImage from "@/assets/img-placeholder.png";
import { useColetores } from "@/hooks/useColetores";

interface InsectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insect: Insect | null;
  onEdit?: (insect: Insect) => void;
  onDelete?: (insect: Insect) => void;
}

interface InsectImage {
  id: number;
  tipo: string;
  dados: string;
  nomeArquivo?: string;
}

export function InsectDetailsDialog({ open, onOpenChange, insect, onEdit, onDelete }: InsectDetailsDialogProps) {
  const [images, setImages] = React.useState<InsectImage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { coletores } = useColetores();

  // Buscar imagens do inseto
  React.useEffect(() => {
    if (open && insect?.id) {
      setLoading(true);
      fetch(`http://localhost:8080/api/imagens/inseto/${insect.id}`)
        .then(res => res.json())
        .then(data => {
          // Supondo que o backend retorna um array de imagens com id e url
          setImages(data);
        })
        .catch(() => setImages([]))
        .finally(() => setLoading(false));
    } else {
      setImages([]);
    }
  }, [open, insect]);

  // Upload de imagem
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !insect?.id) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("arquivo", file);
    try {
      const res = await fetch(`http://localhost:8080/api/imagens/${insect.id}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erro ao enviar imagem");
      setFile(null);
      // Recarregar imagens
      const imgs = await fetch(`http://localhost:8080/api/imagens/inseto/${insect.id}`).then(r => r.json());
      setImages(imgs);
    } catch (err) {
      setError("Falha ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  // Função utilitária para pegar o nome do coletor
  function getNomeColetor(insect: any) {
    if (!insect || !insect.idColetor) return 'Não informado';
    const coletor = coletores.find(c => c.idColetor === insect.idColetor);
    return coletor ? coletor.nomeColetor : 'Não informado';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentNoClose className="max-w-3xl bg-zinc-100 border border-zinc-200 shadow-xl rounded-2xl p-0 overflow-hidden">
        {insect ? (
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Coluna da Imagem */}
            <div className="md:w-1/2 w-full flex flex-col items-center justify-center bg-zinc-200 min-h-[320px] relative p-8">
              {/* ID no topo */}
              <div className="absolute left-4 top-4 text-xs text-zinc-400 flex items-center gap-1 select-all">
                ID: {insect.tag}
                <button
                  type="button"
                  className="ml-1 p-1 hover:bg-zinc-300 rounded"
                  onClick={() => navigator.clipboard.writeText(insect.tag)}
                  title="Copiar ID"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              {/* Imagem principal ou placeholder */}
              <div className="flex-1 flex items-center justify-center w-full">
                {images.length > 0 ? (
                  <img
                    src={`data:${images[0].tipo};base64,${images[0].dados}`}
                    alt={images[0].nomeArquivo || 'Imagem do inseto'}
                    style={{ width: 220, height: 220, objectFit: 'contain' }}
                    className="rounded-lg shadow bg-white"
                  />
                ) : (
                  <Image src={placeholderImage.src} alt="Sem imagem" width={180} height={180} className="opacity-60" />
                )}
              </div>
              {/* Indicador de múltiplas imagens (simples) */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.slice(0,3).map((img, idx) => (
                    <span key={img.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-zinc-700' : 'bg-zinc-400'} inline-block`} />
                  ))}
                  {images.length > 3 && <span className="text-xs text-zinc-500 ml-2">+{images.length-3}</span>}
                </div>
              )}
            </div>
            {/* Coluna das Informações */}
            <div className="md:w-1/2 w-full flex flex-col p-8 gap-2 relative">
              {/* Ícones de ação no topo direito */}
              <div className="absolute right-4 top-2 flex gap-2">
                <button
                  type="button"
                  className="p-2 rounded hover:bg-zinc-200 transition"
                  title="Editar"
                  onClick={() => onEdit && insect && onEdit(insect)}
                >
                  <Pencil className="h-5 w-5 text-zinc-500" />
                </button>
              </div>
              <span className="text-xs text-zinc-400 mb-1">nome científico</span>
              <h2 className="text-2xl font-semibold text-zinc-800 mb-2">{insect.nome}</h2>
              <div className="text-zinc-600 text-sm mb-4" style={{maxHeight: 120, overflowY: 'auto'}}>
                {('descricao' in insect && (insect as any).descricao) ? (insect as any).descricao : 'Sem descrição cadastrada.'}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex gap-8 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">coletado em</span>
                    <span className="flex items-center gap-2 text-zinc-700 font-medium">
                      <MapPin className="h-4 w-4" /> {insect.localColeta}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">data da coleta</span>
                    <span className="flex items-center gap-2 text-zinc-700 font-medium">
                      <Calendar className="h-4 w-4" /> {new Date(insect.dataColeta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">coletado por</span>
                    <span className="flex items-center gap-2 text-zinc-700 font-medium">
                      <User className="h-4 w-4" /> {getNomeColetor(insect)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Upload de imagem */}
              <form onSubmit={handleUpload} className="mt-8 flex flex-col sm:flex-row gap-2 items-center">
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                <Button type="submit" disabled={!file || uploading} className="bg-indigo-600 text-white">
                  {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Adicionar Imagem
                </Button>
                {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-zinc-500">Nenhum inseto selecionado.</div>
        )}
      </DialogContentNoClose>
    </Dialog>
  );
} 