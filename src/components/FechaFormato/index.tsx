import { Typography } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    fecha: any,
    formato: string
}

export const FechaConFormato = (props: FechaConFormatoProps) => {
    
    return (
        <Typography>
            {format(new Date(props.fecha), props.formato, {
                locale: es
            })}
        </Typography>
    )
}

//defult props
FechaConFormato.defaultProps = {
    variant: 'caption'
}

interface FechaConFormatoProps {
    fecha: any,
    formato: string,
    variant?: string
}