export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  estoque: number;
}

export interface Servico {
  id?: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
}

export type TipoOrcamentoItem = "PRODUTO" | "SERVICO";

export interface OrcamentoItem {
  id?: number;
  descricao: string;
  tipoOrcamentoItem: TipoOrcamentoItem;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
  orcamento?: Orcamento;
  produto?: Produto | null;
  servico?: Servico | null;
}

export interface Orcamento {
  id?: number;
  cliente: string;
  dataOrcamento: string;
  observacao: string;
  valorTotal: number;
}
