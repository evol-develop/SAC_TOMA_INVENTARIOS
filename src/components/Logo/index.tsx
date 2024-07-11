import { Box, Hidden, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { APP } from 'src/config';

import './logo.css'
import App from 'src/App';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
        margin-top: 4px;
        transform: scale(.8);
`
);



const LogoTextWrapper = styled(Box)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
`
);

const VersionBadge = styled(Box)(
  ({ theme }) => `
        background: ${theme.palette.success.main};
        color: ${theme.palette.success.contrastText};
        padding: ${theme.spacing(0.4, 1)};
        border-radius: ${theme.general.borderRadiusSm};
        text-align: center;
        display: inline-block;
        line-height: 1;
        font-size: ${theme.typography.pxToRem(11)};
`
);

const LogoText = styled(Box)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(15)};
        font-weight: ${theme.typography.fontWeightBold};
`
);



const Logo = () => (
  <LogoWrapper to="/">
    <LogoSignWrapper>
      {/* <LogoSign>
          <LogoSignInner >
        </LogoSign> */}

      <img className="logo" alt="Logo Clientes" src="/static/images/logo/evolsoft.png" />

    </LogoSignWrapper>
    <Hidden smDown>
      <LogoTextWrapper>
        <Tooltip title={`Versión ${APP.VERSION}`} arrow placement="right">
          <VersionBadge>{APP.VERSION} {APP.FECHA_COMPILACION}</VersionBadge>
        </Tooltip>
        <LogoText>{APP.DESCRIPCION}</LogoText>
      </LogoTextWrapper>
    </Hidden>
  </LogoWrapper>
)

export default Logo;

