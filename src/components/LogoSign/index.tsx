import { Box, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { APP } from 'src/config';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
        margin-bottom: ${theme.spacing(13)};
       
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
`
);




const Logo = () => {

  return (
    <Tooltip title={APP.NOMBRE}  arrow>
      <LogoWrapper to="/">
        <LogoSignWrapper>
          
            <img  style={{width: '150px', height: '150px',marginLeft:'-50px', marginTop : '5px', marginBottom: '50px' }} 
            alt="EvolSoft" src="/static/images/logo/evolsoft.png" />

        

          {/* <LogoSign>
            <LogoSignInner />
          </LogoSign> */}
        </LogoSignWrapper>
      </LogoWrapper>
    </Tooltip>
  );
}

export default Logo;


