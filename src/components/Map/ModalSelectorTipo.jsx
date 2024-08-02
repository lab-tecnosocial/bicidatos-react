import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import './ModalSelectorTipo.css'




export const ModalSelectorTipo = ({ selectedType, options, onClickClose, handleFilterClick }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (event) => {
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
  const buttonColor = selectedType === 'servicios' ? '#44740e' : '#e20000';

  return (
    <Dialog onClose={onClickClose} aria-labelledby="customized-dialog-title" open={true}>
      <DialogTitle id="customized-dialog-title">
        <button className='btn-close' onClick={onClickClose}>
          <Close />
        </button>
      </DialogTitle>
      <DialogContent dividers>
        <div className="modal-list">
          {options.map(option => (
            <label
              key={option.value}
              className='modal-item'
            >
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
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => handleFilterClick(selectedFilters)}
          style={{ backgroundColor: buttonColor, color: '#fff' }}
          disabled={!isFiltersSelected}
        >
          {isFiltersSelected ? "Aplicar Filtros" : "Seleccionar Filtros"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
