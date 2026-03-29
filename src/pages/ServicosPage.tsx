import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicoApi } from "@/services/api";
import type { Servico } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

const emptyServico: Servico = { nome: "", descricao: "", valorUnitario: 0 };

export default function ServicosPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState<Servico>(emptyServico);

  const { data: servicos = [], isLoading } = useQuery({
    queryKey: ["servicos"],
    queryFn: servicoApi.listar,
  });

  const saveMutation = useMutation({
    mutationFn: (s: Servico) => (s.id ? servicoApi.atualizar(s) : servicoApi.inserir(s)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
      setDialogOpen(false);
      toast.success(editing ? "Serviço atualizado!" : "Serviço criado!");
    },
    onError: () => toast.error("Erro ao salvar serviço"),
  });

  const deleteMutation = useMutation({
    mutationFn: servicoApi.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
      toast.success("Serviço excluído!");
    },
    onError: () => toast.error("Erro ao excluir serviço"),
  });

  const openNew = () => { setEditing(null); setForm(emptyServico); setDialogOpen(true); };
  const openEdit = (s: Servico) => { setEditing(s); setForm({ ...s }); setDialogOpen(true); };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie o catálogo de serviços</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Novo Serviço</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : servicos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <Wrench className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                </TableCell>
              </TableRow>
            ) : (
              servicos.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{s.descricao}</TableCell>
                  <TableCell className="text-right">R$ {s.valorUnitario.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => s.id && deleteMutation.mutate(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
          >
            <div>
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Valor Unitário</label>
              <Input type="number" step="0.01" min="0" value={form.valorUnitario} onChange={(e) => setForm({ ...form, valorUnitario: Number(e.target.value) })} required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saveMutation.isPending}>Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
