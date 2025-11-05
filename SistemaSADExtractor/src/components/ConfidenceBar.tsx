import React from "react";
import styles from "./ConfidenceBar.module.css";
import clsx from "clsx";

type Props = {
  value: number; // 0..100
};

export default function ConfidenceBar({ value }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  let colorClass = styles.gray;
  if (clamped >= 70) colorClass = styles.green;
  else if (clamped >= 30) colorClass = styles.yellow;
  else colorClass = styles.red;

  return (
    <div className={styles.wrap} title={`${clamped}%`}>
      <div className={clsx(styles.fill, colorClass)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
