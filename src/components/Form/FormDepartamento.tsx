import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useMap } from 'react-leaflet';
import { Departamento } from '../../types.d';
import './FormDepartamento.css'


interface Props {
  departamentos: Departamento[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      zIndex: 10000,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export const FormDepartamento = ({ departamentos }: Props) => {
  const map = useMap();
  const classes = useStyles();
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
    if (selectedDepartamento && map) {
      const { latitud, longitud } = selectedDepartamento;
      console.log({ latitud, longitud });
      map.flyTo([latitud, longitud], 15, {
        duration: 1, // duración de la animación en segundos
        easeLinearity: 0.25, // suavidad de la animación
      });
    }
  }, [map, selectedDepartamento]);

  return (
    <FormControl variant="filled" className={classes.formControl} onClick={(e) => e.stopPropagation()} >
      <InputLabel htmlFor="filled-age-native-simple">Departamento</InputLabel>
      <Select
        native
        value={selectedDepartamento ? selectedDepartamento.nombre : ''}
        onChange={handleChange}
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
