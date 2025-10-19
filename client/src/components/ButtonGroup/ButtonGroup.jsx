import { useState } from "react";
import styles from "./ButtonGroup.module.sass";

const options = [
  {
    id: "yes_recommended",
    title: "Yes",
    description: "But minor variations are allowed",
    recommended: true,
  },
  {
    id: "yes_exact",
    title: "Yes",
    description: "The Domain should exactly match the name",
    recommended: false,
  },
  {
    id: "no",
    title: "No",
    description: "I am only looking for a name, not a Domain",
    recommended: false,
  },
];

export default function ButtonGroup({ onChange }) {
  const [selected, setSelected] = useState("yes_recommended");

  const handleSelect = (id) => {
    setSelected(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={styles.buttonGroup}>
      {options.map((option) => (
        <div
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`${styles.buttonCard} ${selected === option.id ? styles.active : ""}`}
        >
          {option.recommended && (
            <span className={styles.badge}>Recommended</span>
          )}
          <div className={styles.buttonCardHeader}>
            <h3>{option.title}</h3>
            {selected === option.id && <span className={styles.check}>✔</span>}
          </div>
          <p>{option.description}</p>
        </div>
      ))}
    </div>
  );
}
