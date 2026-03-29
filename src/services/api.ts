import type { Produto, Servico, Orcamento, OrcamentoItem } from "@/types/models";

const API_BASE = "http://localhost:8080";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? JSON.parse(text) : undefined;
}

// Produtos
export const produtoApi = {
  listar: () => request<Produto[]>("/produtos/consultarTodos"),
  buscar: (id: number) => request<Produto>(`/produtos/consultarById/${id}`),
  inserir: (p: Produto) => request<void>("/produtos/inserir", { method: "POST", body: JSON.stringify(p) }),
  atualizar: (p: Produto) => request<void>("/produtos/atualizar", { method: "PUT", body: JSON.stringify(p) }),
  deletar: (id: number) => request<void>(`/produtos/deletar/${id}`, { method: "DELETE", body: JSON.stringify({ id }) }),
};

// Serviços
export const servicoApi = {
  listar: () => request<Servico[]>("/servicos/consultarTodos"),
  buscar: (id: number) => request<Servico>(`/servicos/consultarById/${id}`),
  inserir: (s: Servico) => request<void>("/servicos/inserir", { method: "POST", body: JSON.stringify(s) }),
  atualizar: (s: Servico) => request<void>("/servicos/atualizar", { method: "PUT", body: JSON.stringify(s) }),
  deletar: (id: number) => request<void>(`/servicos/deletar/${id}`, { method: "DELETE", body: JSON.stringify({ id }) }),
};

// Orçamentos
export const orcamentoApi = {
  listar: () => request<Orcamento[]>("/orcamentos/consultarTodos"),
  buscar: (id: number) => request<Orcamento>(`/orcamentos/consultarById/${id}`),
  inserir: (o: Orcamento) => request<void>("/orcamentos/inserir", { method: "POST", body: JSON.stringify(o) }),
  atualizar: (o: Orcamento) => request<void>("/orcamentos/atualizar", { method: "PUT", body: JSON.stringify(o) }),
  deletar: (id: number) => request<void>(`/orcamentos/deletar/${id}`, { method: "DELETE" }),
};

// Itens do Orçamento
export const orcamentoItemApi = {
  listar: (orcamentoId: number) =>
    request<OrcamentoItem[]>(`/orcamentos/${orcamentoId}/itens/consultarTodosByOrcamentoId`),
  buscar: (orcamentoId: number, id: number) =>
    request<OrcamentoItem>(`/orcamentos/${orcamentoId}/itens/consultarById/${id}`),
  inserir: (orcamentoId: number, item: OrcamentoItem) =>
    request<OrcamentoItem>(`/orcamentos/${orcamentoId}/itens/inserir`, { method: "POST", body: JSON.stringify(item) }),
  atualizar: (orcamentoId: number, id: number, item: OrcamentoItem) =>
    request<OrcamentoItem>(`/orcamentos/${orcamentoId}/itens/atualizar/${id}`, { method: "PUT", body: JSON.stringify(item) }),
  deletar: (orcamentoId: number, id: number) =>
    request<void>(`/orcamentos/${orcamentoId}/itens/deletar/${id}`, { method: "DELETE" }),
};
