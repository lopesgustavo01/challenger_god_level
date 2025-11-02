/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

interface ConfirmStateProps {
  store: {
    id: number;
    name: string;
    state: string;
  };
  onConfirm: (selected: string) => void;
  onCancel: () => void;
}

export function ConfirmState({ store, onConfirm, onCancel }: ConfirmStateProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const allStates = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
    "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
    "RS","RO","RR","SC","SP","SE","TO"
  ];

  function generateOptions(correctState: string) {
    const filtered = allStates.filter(st => st !== correctState);
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 8); 
    const result = [...shuffled, correctState].sort(() => Math.random() - 0.5);
    setOptions(result);
  }

  useEffect(() => {
    generateOptions(store.state);
  }, [store.state]);

  const correct = selected === store.state;

  const handleConfirm = () => {
    if(correct && selected) onConfirm(selected)
  };

  useEffect(() => {
    if(selected) handleConfirm()
  }, [selected])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-lg p-6 bg-[var(--card)] rounded-2xl shadow-lg space-y-6 text-center border border-[var(--border)]">

        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Qual estado fica a loja <span className="text-[var(--accent)]">{store.name}</span>?
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {options.map(st => (
            <button
              key={st}
              onClick={() => setSelected(st)}
              className={`p-3 rounded-xl border font-bold transition
                ${selected === st 
                  ? "bg-[var(--accent)] text-[var(--primary-foreground)] border-[var(--accent)]" 
                  : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)]/20 border-[var(--border)]"}
              `}
            >
              {st}
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex flex-col items-center gap-3 mt-4">
            {correct ? (
              <CheckCircle className="text-green-600 w-10 h-10" />
            ) : (
              <XCircle className="text-red-600 w-10 h-10" />
            )}

            {!correct && (
              <div className="flex items-center gap-2 text-[var(--accent)] bg-[var(--accent)]/10 p-2 px-3 rounded-lg border border-[var(--accent)]">
                <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
                <span className="font-semibold">{store.state}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border rounded-xl hover:bg-[var(--muted)]/20 text-[var(--foreground)] transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
