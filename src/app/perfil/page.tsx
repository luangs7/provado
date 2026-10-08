import PainelPerfil from "@/components/PainelPerfil";

export const metadata = { title: "Seu perfil" };

// O perfil vem todo do estado da demonstração, que vive no navegador
export default function Perfil() {
  return <PainelPerfil />;
}
