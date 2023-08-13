import { useState } from 'react';
import { Close } from '@material-ui/icons';
import './ModalServices.css'

interface Props {
  onClickClose: () => void;
  handleFilterClick: (selectedFilters: string[]) => void;
}

interface Option {
  label: string;
  value: string;
}

export const ModalServices = ({ onClickClose, handleFilterClick }: Props) => {
  const options: Option[] = [
    { label: 'Tienda de bicicleta', value: 'Tienda de bicicleta' },
    { label: 'Taller de repuestos', value: 'Taller de repuestos' },
    { label: 'Llantería de bicicleta', value: 'Llantería de bicicleta' }
  ];
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedFilters((prev) => [...prev, value]);
    } else {
      setSelectedFilters((prev) =>
        prev.filter((filter) => filter !== value)
      );
    }
  };
  const isFiltersSelected = selectedFilters.length > 0;

  return (
    <div className="modal">
      <div className="modal-list">
        {options.map(option => (
          <label key={option.value} className='modal-item'>
            <input
              type="checkbox"
              value={option.value}
              className="filter-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedFilters.includes(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <button
        className='btn-close'
        onClick={onClickClose}
      >
        <Close />
      </button>
      <button
        className={`btn-filter ${isFiltersSelected ? "btnFilter-active" : "btnFilter-inactive"}`}
        onClick={() => handleFilterClick(selectedFilters)}
        disabled={!isFiltersSelected}
      >
        {isFiltersSelected ? "Aplicar Filtros" : "Seleccionar Filtros"}
      </button>
    </div>
  )
}
