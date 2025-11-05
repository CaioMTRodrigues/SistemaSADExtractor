import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Tipos base */
export type ActionKind = "revisar" | "prosseguir" | "descartado";

export type FileItem = {
  id: string;
  name: string;
  file?: File; // opcional para quando vier do input real
};

export type EditRow = {
  id: number;
  name: string;
  extracted: number;
  total: number;
  confidence: number;   // 0..100
  action: ActionKind;
  checked: boolean;
  error?: boolean;
};

type SADState = {
  /** 1 = Upload, 2 = Edição, 3 = Exportação */
  step: 1 | 2 | 3;

  /** arquivos “crus” escolhidos na etapa 1 */
  files: FileItem[];

  /** linhas da etapa 2 (derivadas ou vindas do backend) */
  rows: EditRow[];

  /** --- actions --- */
  setStep: (s: 1 | 2 | 3) => void;

  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;

  /** gera rows mockadas a partir de files (até integrar API) */
  generateRowsFromFiles: () => void;

  setRows: (rows: EditRow[]) => void;
  toggleRow: (id: number, checked: boolean) => void;
  removeRow: (id: number) => void;
  removeSelected: () => void;
};

export const useSADStore = create<SADState>()(
  persist(
    (set, get) => ({
      step: 1,
      files: [],
      rows: [],

      setStep: (s) => set({ step: s }),

      addFiles: (incoming) => {
        const now = Date.now();
        const newItems: FileItem[] = incoming.map((f, idx) => ({
          id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${idx}`,
          name: f.name,
          file: f,
        }));
        set({ files: [...get().files, ...newItems] });
      },

      removeFile: (id) => {
        set({ files: get().files.filter((f) => f.id !== id) });
      },

      clearFiles: () => set({ files: [] }),

      generateRowsFromFiles: () => {
        const files = get().files;
        // Mock: derive linhas com números “plausíveis”
        const rows: EditRow[] = files.map((f, i) => {
          // números fixos para manter consistência visual
          const total = 30;
          // use uma distribuição para dar variedade:
          const presets = [
            { extracted: 12, conf: 40, action: "revisar" as const, error: false },
            { extracted: 30, conf: 100, action: "prosseguir" as const, error: false },
            { extracted: 21, conf: 70, action: "prosseguir" as const, error: false },
            { extracted: 3, conf: 10, action: "descartado" as const, error: true },
          ];
          const p = presets[i % presets.length];
          return {
            id: i + 1,
            name: f.name,
            extracted: p.extracted,
            total,
            confidence: p.conf,
            action: p.action,
            checked: p.action !== "descartado", // marca automaticamente os bons
            error: p.error,
          };
        });
        set({ rows });
      },

      setRows: (rows) => set({ rows }),

      toggleRow: (id, checked) =>
        set({
          rows: get().rows.map((r) => (r.id === id ? { ...r, checked } : r)),
        }),

      removeRow: (id) =>
        set({
          rows: get().rows.filter((r) => r.id !== id),
        }),

      removeSelected: () =>
        set({
          rows: get().rows.filter((r) => !r.checked),
        }),
    }),
    {
      name: "sad-extractor-store", // persiste no localStorage (opcional)
      partialize: (state) => ({
        step: state.step,
        files: state.files,
        rows: state.rows,
      }),
    }
  )
);
