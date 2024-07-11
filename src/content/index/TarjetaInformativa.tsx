import { Box, Card, Link, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CardContentWrapper } from './Styles'

    
interface Props{
    AvatarStyle : any
    IconStyle : any
    valorIndicador: string
    titulo: string
    textoLink: string
    urlLink: string
    descripcionAdicional: string
}

export const TarjetaInformativa = ({ AvatarStyle, IconStyle, valorIndicador, titulo, textoLink, urlLink, descripcionAdicional }:Props) => {

    
    const navigation = useNavigate()

    const onClick = () => {
        navigation(urlLink)
    }
    



    return (
        <Card>
            <CardContentWrapper>
                <Typography variant="overline" color="text.primary">
                    {titulo}
                </Typography>

                <ListItem
                    disableGutters
                    sx={{
                        my: 1
                    }}
                    component="div"
                >
                    <ListItemAvatar>
                        <AvatarStyle variant="rounded"  >
                            <IconStyle fontSize="large" />
                        </AvatarStyle>
                    </ListItemAvatar>

                    <ListItemText
                        primary={valorIndicador}
                        primaryTypographyProps={{
                            variant: 'h1',
                            sx: {
                                ml: 2
                            },
                            noWrap: true
                        }}
                    />
                </ListItem>
                <ListItem
                    disableGutters
                    sx={{
                        mt: 0.5,
                        mb: 1.5
                    }}
                    component="div"
                >
                    <ListItemText
                        primary={
                            <>
                                <Link fontWeight="bold"  onClick={onClick}  >
                                    {textoLink}
                                </Link>
                                <Box
                                    component="span"
                                    sx={{
                                        pl: 0.5
                                    }}
                                >
                                    {descripcionAdicional}.
                                </Box>
                            </>
                        }
                        primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                    />
                </ListItem>
            </CardContentWrapper>
        </Card>
    );
}


