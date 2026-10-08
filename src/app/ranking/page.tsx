import { redirect } from "next/navigation";

// O ranking virou a ordenação "Mais bem avaliados" da busca de produtos
export default function Ranking() {
  redirect("/produtos");
}
