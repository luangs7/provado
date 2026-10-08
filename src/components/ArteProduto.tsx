// Foto de exemplo: um desenho simples do tipo de produto, na cor do produto.
// Quando a foto foi enviada por você, mostra a imagem de verdade.

import Image from "next/image";
import type { Categoria } from "@/lib/tipos";
import { ehImagemEnviada } from "@/lib/imagens";

const DESENHOS: Record<Categoria, { corpo: string; detalhes?: string }> = {
  tenis: {
    corpo: "M14 78 C14 66 20 60 30 58 L50 54 C56 44 62 38 70 36 L78 36 C80 46 86 54 98 58 L108 62 C114 65 114 74 110 80 Z M10 80 L112 80 C112 88 106 92 98 92 L20 92 C14 92 10 88 10 80 Z",
    detalhes: "M58 48 L66 52 M62 43 L70 47 M54 53 L62 57 M16 66 L24 64",
  },
  camisetas: {
    corpo: "M42 20 L22 28 L8 50 L24 58 L32 46 L32 102 L88 102 L88 46 L96 58 L112 50 L98 28 L78 20 C74 30 68 34 60 34 C52 34 46 30 42 20 Z",
  },
  moletons: {
    corpo: "M42 24 L24 32 L12 94 L28 96 L32 60 L32 104 L88 104 L88 60 L92 96 L108 94 L96 32 L78 24 C78 12 70 6 60 6 C50 6 42 12 42 24 Z",
    detalhes: "M42 80 L78 80 L84 98 L36 98 Z M48 24 C50 34 70 34 72 24",
  },
  jaquetas: {
    corpo: "M44 18 L24 28 L12 94 L28 96 L32 58 L32 104 L88 104 L88 58 L92 96 L108 94 L96 28 L76 18 L60 30 Z",
    detalhes: "M60 30 L60 104 M44 18 L50 10 L60 30 L70 10 L76 18",
  },
  calcas: {
    corpo: "M34 12 L86 12 L92 108 L68 108 L60 44 L52 108 L28 108 Z",
    detalhes: "M34 20 L86 20 M36 56 L50 56 L50 72 L36 72 Z",
  },
  bones: {
    corpo: "M22 72 C22 40 40 30 60 30 C84 30 98 44 98 72 Z M22 72 C50 64 90 66 112 80 C112 86 106 88 100 86 C76 80 48 78 22 80 Z",
    detalhes: "M60 30 L60 70",
  },
  mochilas: {
    corpo: "M30 34 C30 22 40 16 60 16 C80 16 90 22 90 34 L92 106 L28 106 Z",
    detalhes: "M40 70 L80 70 L80 98 L40 98 Z M34 30 L86 30 M50 16 L50 8 L70 8 L70 16",
  },
};

type Props = {
  categoria: Categoria;
  cor: string;
  foto?: string; // ângulo ("Frente", "Sola"...) ou imagem enviada (data URL)
  legenda?: boolean;
  className?: string;
};

export default function ArteProduto({ categoria, cor, foto = "Frente", legenda = false, className = "" }: Props) {
  const enviada = ehImagemEnviada(foto);

  return (
    <div
      className={`relative aspect-square max-w-full overflow-hidden rounded-md ${className}`}
      style={{ background: `color-mix(in srgb, ${cor} 22%, #f6f7f9)` }}
    >
      {enviada ? (
        <Image src={foto} alt="Foto enviada" fill unoptimized className="object-cover" />
      ) : (
        <Desenho categoria={categoria} cor={cor} angulo={foto} />
      )}
      {legenda && !enviada && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-cartao/90 px-1.5 py-0.5 text-[11px] text-apagado">
          {foto}
        </span>
      )}
    </div>
  );
}

function Desenho({ categoria, cor, angulo }: { categoria: Categoria; cor: string; angulo: string }) {
  const { corpo, detalhes } = DESENHOS[categoria];

  if (angulo === "Etiqueta") {
    return (
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x="32" y="26" width="56" height="68" rx="4" fill="#fff" stroke="#131c2b" strokeWidth="3" />
        <path d="M42 42 H78 M42 54 H72 M42 66 H78 M42 78 H62" stroke="#131c2b" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Sola do tênis vista de baixo
  if (angulo === "Sola") {
    return (
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M12 60 C12 44 30 38 52 40 C70 42 80 36 96 36 C108 36 112 48 110 60 C108 74 96 82 80 80 C66 78 58 82 40 82 C22 82 12 74 12 60 Z"
          fill="#e9e6dc"
          stroke="#131c2b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M30 50 V72 M42 48 V76 M54 48 V76 M74 44 V74 M86 42 V74 M98 44 V70" stroke={cor} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  const transformacao =
    angulo === "Lateral" || angulo === "Costas"
      ? "translate(120 0) scale(-1 1)"
      : angulo === "Medida"
        ? "translate(18 6) scale(0.7)"
        : undefined;

  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
      <g transform={transformacao}>
        <path
          d={corpo}
          fill={angulo === "Interior" ? "#30343a" : cor}
          stroke="#131c2b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {detalhes && (
          <path d={detalhes} fill="none" stroke="#131c2b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>
      {angulo === "Medida" && (
        <g stroke="#2c54e0" strokeWidth="2.5" strokeLinecap="round">
          <path d="M14 104 H106" />
          {[14, 32, 50, 68, 86, 106].map((x) => (
            <path key={x} d={`M${x} 98 V110`} />
          ))}
        </g>
      )}
    </svg>
  );
}
