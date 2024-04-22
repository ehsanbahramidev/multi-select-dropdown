import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/components/MultiSelect.module.scss';

interface MultiSelectProps {
  options: string[];
  selected?: string[]; // Optional initial selected options
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(selected);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Element)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelectedItems((prev) => [...prev, option]);
    setInputValue('');
    onChange(selectedItems);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddCustom = () => {
    if (inputValue.trim()) {
      setSelectedItems((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
      onChange(selectedItems);
    }
  };

  const handleRemove = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
    onChange(selectedItems);
  };

  return (
    <div className={styles.multiselect} ref={dropdownRef}>
      <div className={styles.selecteditems}>
        {selectedItems.map((item) => (
          <div className={styles.item} key={item}>
            <span>{item}</span>
            <button onClick={() => handleRemove(item)}>x</button>
          </div>
        ))}
        <input
          type="text"
          placeholder="Select or add new..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAddCustom();
            }
          }}
        />
        <button type="button" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? styles.arrowIconOpen : styles.arrowIconClosed}></i>
        </button>
      </div>
      {isOpen && (
        <ul className={styles.optionslist}>
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
