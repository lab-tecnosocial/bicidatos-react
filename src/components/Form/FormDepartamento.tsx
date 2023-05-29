import { useEffect, useState, useRef } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useMap } from 'react-leaflet';
import './FormDepartamento.css'
import L from 'leaflet';
import { Departamento } from '../../store/models';

interface Props {
  departamentos: Departamento[]
}

export const FormDepartamento = ({ departamentos }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const map = useMap();
  const [selectedDepartamento, setSelectedDepartamento] = useState<{ nombre: string; latitud: number; longitud: number } | null>(null);


  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value = event.target.value as string;
    const departamento = departamentos.find(d => d.nombre === value);
    if (departamento) {
      setSelectedDepartamento({ nombre: departamento.nombre, latitud: departamento.latitud, longitud: departamento.longitud });
    } else {
      setSelectedDepartamento(null);
    }
  };

  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
    }
    if (selectedDepartamento && map) {
      const { latitud, longitud } = selectedDepartamento;
      console.log({ latitud, longitud });
      map.flyTo([latitud, longitud], selectedDepartamento['nombre'] == 'Todos' ? 6 : 12, {
        duration: 1, // duración de la animación en segundos
        easeLinearity: 0.25, // suavidad de la animación
      });
    }
  }, [map, selectedDepartamento]);

  return (
    <FormControl ref={ref} variant="filled" className="form-departamento">
      <InputLabel htmlFor="filled-age-native-simple" style={{ width: '100%' }} >Departamento</InputLabel>
      <Select
        native
        value={selectedDepartamento ? selectedDepartamento.nombre : ''}
        onChange={handleChange}
        style={{ borderRadius: '50px' }}
        inputProps={{
          name: 'nombre',
          id: 'filled-age-native-simple',
        }}
      >
        <option aria-label="None" value="" />
        {
          departamentos.map(option => (
            <option key={option.id} value={option.nombre}>{option.nombre}</option>
          ))
        }
      </Select>
    </FormControl >
  )
}
