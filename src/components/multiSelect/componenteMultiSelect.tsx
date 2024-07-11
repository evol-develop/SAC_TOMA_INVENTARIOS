import React, { useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { usePage } from 'src/hooks/usePage';
import { ObrasInfoInterface } from 'src/interfaces/entidades/Vistas/obrasInfoInterface';
import { createSlot } from 'src/store/slices/page';

export default function MultiSelect(props: MultiSelectProps) {
  const { dispatch } = usePage();

  const [ItemsSeleccionados, setItemsSeleccionados] = useState([]);

  const handleChangeMultiSelectObras = (
    event: any,
    newValue: ObrasInfoInterface[]
  ) => {
    const todas = newValue.find((item) => item.nombre === 'TODAS');

    let newList: ObrasInfoInterface[] = [...ItemsSeleccionados];

    if (todas) {
      newList = [];
      newList.push(todas);
    } else {
      newList = newValue;
    }

    let listaIds = [];
    newList.forEach((element) => {
      listaIds.push(element.id);
    });

    setItemsSeleccionados(newList);

    dispatch(createSlot({ [`Multiselect${props.slotName}`]: listaIds }));
  };

  return props.options ? (
    <Autocomplete
      size="small"
      multiple
      id="tags-outlined"
      options={props.options}
      getOptionLabel={(option) => option.nombre}
      defaultValue={[props.options[0]]}
      filterSelectedOptions
      value={ItemsSeleccionados}
      renderInput={(params) => (
        <TextField {...params} label="Obras" placeholder="" />
      )}
      onChange={(event, newValue) =>
        handleChangeMultiSelectObras(event, newValue)
      }
      isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
    />
  ) : (
    <CircularProgress size={15} />
  );
}

interface MultiSelectProps {
  options: any[];
  slotName: string;
}
