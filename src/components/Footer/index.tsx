// import { Box, Container, Link, Typography } from '@mui/material';
import { Box, Card, Link, Typography, styled } from '@mui/material';
import { APP } from 'src/config';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;        
        margin-top: ${theme.spacing(10)};`
);

const Footer =()=> {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={3}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; {new Date().getFullYear()} - {APP.DESCRIPCION}
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by <Link href="https://www.evolsoft.com.mx/" target="_blank" rel="noopener noreferrer">EvolSoft.</Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
