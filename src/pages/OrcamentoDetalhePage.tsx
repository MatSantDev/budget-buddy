import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orcamentoApi, orcamentoItemApi, produtoApi, servicoApi } from "@/services/api";
import type { OrcamentoItem, TipoOrcamentoItem } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Pencil, Trash2, Package, Wrench } from "lucide-react";
import { toast } from "sonner";

const emptyItem: OrcamentoItem = {
  descricao: "",
  tipoOrcamentoItem: "PRODUTO",
  quantidade: 1,
  valorUnitario: 0,
  subtotal: 0,
  produto: null,
  servico: null,
};

export default function OrcamentoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const orcamentoId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OrcamentoItem | null>(null);
  const [form, setForm] = useState<OrcamentoItem>(emptyItem);

  const { data: orcamento } = useQuery({
    queryKey: ["orcamento", orcamentoId],
    queryFn: () => orcamentoApi.buscar(orcamentoId),
    enabled: !!orcamentoId,
  });

  const { data: itens = [], isLoading: itensLoading } = useQuery({
    queryKey: ["orcamento-itens", orcamentoId],
    queryFn: () => orcamentoItemApi.listar(orcamentoId),
    enabled: !!orcamentoId,
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ["produtos"],
    queryFn: produtoApi.listar,
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ["servicos"],
    queryFn: servicoApi.listar,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["orcamento-itens", orcamentoId] });
    queryClient.invalidateQueries({ queryKey: ["orcamento", orcamentoId] });
    queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
  };

  const saveMutation = useMutation({
    mutationFn: (item: OrcamentoItem) =>
      item.id
        ? orcamentoItemApi.atualizar(orcamentoId, item.id, item)
        : orcamentoItemApi.inserir(orcamentoId, item),
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      toast.success(editing ? "Item atualizado!" : "Item adicionado!");
    },
    onError: (err) => toast.error(err.message || "Erro ao salvar item"),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => orcamentoItemApi.deletar(orcamentoId, itemId),
    onSuccess: () => {
      invalidate();
      toast.success("Item removido!");
    },
    onError: () => toast.error("Erro ao remover item"),
  });

  const openNew = () => { setEditing(null); setForm(emptyItem); setDialogOpen(true); };
  const openEdit = (item: OrcamentoItem) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };

  const handleTipoChange = (tipo: TipoOrcamentoItem) => {
    setForm({ ...form, tipoOrcamentoItem: tipo, produto: null, servico: null, valorUnitario: 0 });
  };

  const handleSelectItem = (itemId: string) => {
    if (form.tipoOrcamentoItem === "PRODUTO") {
      const p = produtos.find((x) => x.id === Number(itemId));
      if (p) setForm({ ...form, produto: p, servico: null, valorUnitario: p.valorUnitario, descricao: p.nome });
    } else {
      const s = servicos.find((x) => x.id === Number(itemId));
      if (s) setForm({ ...form, servico: s, produto: null, valorUnitario: s.valorUnitario, descricao: s.nome });
    }
  };

  if (!orcamento) return <div className="p-8 text-muted-foreground">Carregando...</div>;

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/orcamentos")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cliente</CardTitle></CardHeader>
          <CardContent><p className="font-display text-lg font-semibold">{orcamento.cliente}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Data</CardTitle></CardHeader>
          <CardContent><p className="font-display text-lg font-semibold">{orcamento.dataOrcamento}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Valor Total</CardTitle></CardHeader>
          <CardContent><p className="font-display text-lg font-semibold text-accent">R$ {orcamento.valorTotal.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      {orcamento.observacao && (
        <Card className="mb-6">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground"><strong>Observação:</strong> {orcamento.observacao}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">Itens do Orçamento</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Adicionar Item</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {itensLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : itens.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum item adicionado</TableCell></TableRow>
            ) : (
              itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={item.tipoOrcamentoItem === "PRODUTO" ? "default" : "secondary"}>
                      {item.tipoOrcamentoItem === "PRODUTO" ? <Package className="h-3 w-3 mr-1" /> : <Wrench className="h-3 w-3 mr-1" />}
                      {item.tipoOrcamentoItem === "PRODUTO" ? "Produto" : "Serviço"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell className="text-right">{item.quantidade}</TableCell>
                  <TableCell className="text-right">R$ {item.valorUnitario.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">R$ {item.subtotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => item.id && deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle className="font-display">{editing ? "Editar Item" : "Adicionar Item"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}>
            <div>
              <label className="text-sm font-medium text-foreground">Tipo</label>
              <Select value={form.tipoOrcamentoItem} onValueChange={(v) => handleTipoChange(v as TipoOrcamentoItem)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUTO">Produto</SelectItem>
                  <SelectItem value="SERVICO">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                {form.tipoOrcamentoItem === "PRODUTO" ? "Produto" : "Serviço"}
              </label>
              <Select
                value={String(form.tipoOrcamentoItem === "PRODUTO" ? form.produto?.id || "" : form.servico?.id || "")}
                onValueChange={handleSelectItem}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {form.tipoOrcamentoItem === "PRODUTO"
                    ? produtos.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nome} — R$ {p.valorUnitario.toFixed(2)}</SelectItem>)
                    : servicos.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nome} — R$ {s.valorUnitario.toFixed(2)}</SelectItem>)
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Quantidade</label>
                <Input type="number" min="1" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Valor Unitário</label>
                <Input type="number" step="0.01" min="0" value={form.valorUnitario} onChange={(e) => setForm({ ...form, valorUnitario: Number(e.target.value) })} required />
              </div>
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
