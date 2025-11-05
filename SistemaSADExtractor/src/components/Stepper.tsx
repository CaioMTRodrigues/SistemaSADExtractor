import React from "react";
import styles from "./Stepper.module.css";
import clsx from "clsx";

type Step = { id: number; label: string };
type Props = {
  current: number;        // 1..N
  subprogress?: number;   // 0..1 => progresso entre o passo atual e o próximo
  className?: string;
};

const steps: Step[] = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Edição" },
  { id: 3, label: "Exportação" },
];

const Stepper: React.FC<Props> = ({ current, subprogress = 0, className }) => {
  const segments = steps.length - 1;
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const widthPct = clamp(((current - 1) + clamp(subprogress)) / segments) * 100;

  return (
    <div className={clsx(styles.stepper, className)}>
      <div className={styles.track} />
      <div className={styles.fill} style={{ width: `${widthPct}%` }} />
      <div className={styles.items}>
        {steps.map((s) => {
          const state =
            s.id < current ? "done" : s.id === current ? "active" : "idle";
          return (
            <div key={s.id} className={styles.item}>
              <div
                className={clsx(
                  styles.bullet,
                  state === "active" && styles.active,
                  state === "done" && styles.done
                )}
              >
                {s.id}
              </div>
              <div className={styles.label}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
