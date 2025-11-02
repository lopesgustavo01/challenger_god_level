import ReactMarkdown from "react-markdown";
import { X } from "lucide-react"; // Importe o ícone X

interface AIModalProps {
  open: boolean;
  loading: boolean;
  insights: string | null;
  onClose: () => void;
}

export const AIModal = ({ open, loading, insights, onClose }: AIModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Mudança: Adicionado 'flex flex-col' e 'max-h-[85vh]' para 
        permitir um cabeçalho fixo e conteúdo rolável 
      */}
      <div className="bg-[var(--card)] text-[var(--foreground)] rounded-lg w-full max-w-4xl shadow-lg flex flex-col max-h-[85vh]">
        
        {/* 1. Cabeçalho Fixo */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            🤖 Análise da IA
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] rounded-full p-1 hover:bg-[var(--hover)] hover:text-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2. Conteúdo Rolável */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              {/* Loader padrão do Tailwind */}
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
              <p className="text-lg font-medium text-[var(--muted-foreground)]">
                Gerando insights...
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Isso pode levar alguns segundos.
              </p>
            </div>
          ) : (
            /* 3. A Mágica do PROSE:
              - 'prose': Aplica estilos de tipografia.
              - 'max-w-full': Remove o limite de largura padrão do prose.
              - 'dark:prose-invert': Inverte as cores para o modo escuro.
              - 'prose-headings:text-[var(--foreground)]': Força os H1, H2... a usar sua cor.
              - 'prose-p:text-[var(--muted-foreground)]': Força os parágrafos a usar sua cor.
              - 'prose-a:text-[var(--primary)]': Estiliza links com sua cor primária.
            */
            <div
              className="prose prose-base max-w-full dark:prose-invert 
                         prose-headings:text-[var(--foreground)]
                         prose-p:text-[var(--muted-foreground)]
                         prose-strong:text-[var(--foreground)]
                         prose-ul:text-[var(--muted-foreground)]
                         prose-li:text-[var(--muted-foreground)]
                         prose-a:text-[var(--primary)] hover:prose-a:underline"
            >
              <ReactMarkdown>
                {insights || "Nenhum insight disponível."}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};