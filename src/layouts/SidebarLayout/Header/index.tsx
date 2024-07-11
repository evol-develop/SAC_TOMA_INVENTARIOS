import { useContext } from 'react';

import { Box, Button, Hidden, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import HeaderMenu from './Menu';
import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import Logo from 'src/components/Logo';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import { ProductosEmpresa } from 'src/interfaces/productosInterface';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 5;
        background-color: ${theme.header.background};
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
)

const CompaniaBox = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
        height: ${theme.header.height};
        color: ${theme.header.textColor};
`
);

const Header = () => {

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const dataEmpresa = (useAppSelector((state: RootState) => state.empresa) as unknown) as EmpresaInterface
  const dataSucursal = (useAppSelector((state: RootState) => state.empresa.sucursal) as unknown) as sucursalInterface
  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">

        <Hidden lgUp>
          <Logo />
        </Hidden>

        <Hidden mdDown>
          <HeaderMenu />
        </Hidden>
      </Box>
      <CompaniaBox>
        <Box  >
        <Typography variant="h4" gutterBottom align='center'>
            {dataEmpresa.nombre}{"  "}{dataEmpresa.direccion}{"  "}{dataEmpresa.telefono} 
            </Typography>
            <div></div>
            {dataSucursal?(
              <><Typography variant="h4" gutterBottom align='center'>
              {dataSucursal.nombre_corto}
            </Typography><Typography variant="body1" gutterBottom align='center'>
                {dataSucursal.domicilio}
              </Typography><Typography variant="body1" gutterBottom align='center'>
                {dataSucursal.telefono}
              </Typography></>
            ):null}
          
        </Box>

      </CompaniaBox>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />

        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Hidden>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
