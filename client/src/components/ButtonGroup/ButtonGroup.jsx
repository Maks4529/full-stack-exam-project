import ButtonOption from './ButtonOption';
import styles from './ButtonGroup.module.sass';

export default function ButtonGroup({ options, selected, onSelect }) {
  return (
    <div className={styles.buttonGroup}>
      {options.map((option) => (
        <ButtonOption
          key={option.id}
          id={option.id}
          title={option.title}
          description={option.description}
          isRecommended={option.recommended}
          isSelected={selected === option.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
