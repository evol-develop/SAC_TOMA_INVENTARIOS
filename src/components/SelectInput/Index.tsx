
import React from 'react';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function SelectInput(props: Props) {
  return (
    <div>
      {/* <label className="form-label">
        {props.label}
      </label> */}
      {/* <select 
        onChange={props.onChange} 
        value={props.options.find((producto) => producto.value === props.value)?.value}
        className={props.className}
      >
        {props.options.map((producto) => (
          <option key={producto.value} value={producto.value}>
            {producto.desc}
          </option>
        ))}
      </select> */}

<Select
        fullWidth
        value={props.value}
        onChange={props.onChange}
        className={props.className}
        inputProps={{
          name: 'id_producto'
        }}
        disabled={props.disabled}
        size={props.size}
      >
        {props.options.map((producto) => (
          <MenuItem key={producto.value} value={producto.value}>
            {producto.desc}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default SelectInput;

interface Props {
  label: string;
  options: { value: number; desc: string }[];
  onChange: (event: SelectChangeEvent<number>) => void;
  value: number;
  className: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}
