export type Transacao = {
  id?: string;
  valor: number;
  tipo: "entrada" | "saida";
  descricao: string;
  categoria: string;
  data: any;
  mes: string;
};