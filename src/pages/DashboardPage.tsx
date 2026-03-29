import { useQuery } from "@tanstack/react-query";
import { orcamentoApi, produtoApi, servicoApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, Wrench, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: produtos = [] } = useQuery({ queryKey: ["produtos"], queryFn: produtoApi.listar });
  const { data: servicos = [] } = useQuery({ queryKey: ["servicos"], queryFn: servicoApi.listar });
  const { data: orcamentos = [] } = useQuery({ queryKey: ["orcamentos"], queryFn: orcamentoApi.listar });

  const totalOrcamentos = orcamentos.reduce((sum, o) => sum + o.valorTotal, 0);

  const stats = [
    { label: "Produtos", value: produtos.length, icon: Package, color: "text-primary", link: "/produtos" },
    { label: "Serviços", value: servicos.length, icon: Wrench, color: "text-muted-foreground", link: "/servicos" },
    { label: "Orçamentos", value: orcamentos.length, icon: FileText, color: "text-accent", link: "/orcamentos" },
    { label: "Valor Total", value: `R$ ${totalOrcamentos.toFixed(2)}`, icon: DollarSign, color: "text-accent", link: "/orcamentos" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Painel</h1>
        <p className="text-muted-foreground mt-1">Visão geral do sistema de orçamentos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(s.link)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {orcamentos.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold mb-4">Últimos Orçamentos</h2>
          <div className="space-y-2">
            {orcamentos.slice(0, 5).map((o) => (
              <Card
                key={o.id}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/orcamentos/${o.id}`)}
              >
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{o.cliente}</p>
                    <p className="text-sm text-muted-foreground">{o.dataOrcamento}</p>
                  </div>
                  <p className="font-display font-semibold text-accent">R$ {o.valorTotal.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
