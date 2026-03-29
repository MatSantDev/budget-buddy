import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { orcamentoApi } from "@/services/api";
import type { Orcamento } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Eye, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

const emptyOrcamento: Orcamento = { cliente: "", dataOrcamento: new Date().toISOString().split("T")[0], observacao: "", valorTotal: 0 };

export default function OrcamentosPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Orcamento>(emptyOrcamento);

  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ["orcamentos"],
    queryFn: orcamentoApi.listar,
  });

  const createMutation = useMutation({
    mutationFn: orcamentoApi.inserir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      setDialogOpen(false);
      toast.success("Orçamento criado!");
    },
    onError: () => toast.error("Erro ao criar orçamento"),
  });

  const deleteMutation = useMutation({
    mutationFn: orcamentoApi.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      toast.success("Orçamento excluído!");
    },
    onError: () => toast.error("Erro ao excluir orçamento"),
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground text-sm mt-1">Crie e gerencie seus orçamentos</p>
        </div>
        <Button onClick={() => { setForm(emptyOrcamento); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Novo Orçamento
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : orcamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">Nenhum orçamento cadastrado</p>
                </TableCell>
              </TableRow>
            ) : (
              orcamentos.map((o) => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/orcamentos/${o.id}`)}>
                  <TableCell className="font-medium">#{o.id}</TableCell>
                  <TableCell>{o.cliente}</TableCell>
                  <TableCell className="text-muted-foreground">{o.dataOrcamento}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{o.observacao}</TableCell>
                  <TableCell className="text-right font-medium">R$ {o.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/orcamentos/${o.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => o.id && deleteMutation.mutate(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle className="font-display">Novo Orçamento</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}>
            <div>
              <label className="text-sm font-medium text-foreground">Cliente</label>
              <Input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Data</label>
              <Input type="date" value={form.dataOrcamento} onChange={(e) => setForm({ ...form, dataOrcamento: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Observação</label>
              <Textarea value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>Criar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
