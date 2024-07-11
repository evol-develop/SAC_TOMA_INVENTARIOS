
import { Box, Card, styled } from "@mui/material";



export const LocalStyled = () => {

    const Input = styled('input')({
        display: 'none'        
      });


    const AvatarWrapper = styled(Card)(
        ({ theme }) => `
      
          position: relative;
          overflow: visible;
          display: inline-block;
          margin-top: -${theme.spacing(9)};
          margin-left: ${theme.spacing(2)};
      
          .MuiAvatar-root {
            width: ${theme.spacing(14)};
            height: ${theme.spacing(14)};
            border-radius: ${theme.spacing(7)};
            
          }
      `
    )

    const ButtonUploadWrapper = styled(Box)(
        ({ theme }) => `
          position: absolute;
          width: ${theme.spacing(4)};
          height: ${theme.spacing(4)};
          bottom: -${theme.spacing(1)};
          right: -${theme.spacing(1)};
      
          .MuiIconButton-root {
            border-radius: 100%;
            background: ${theme.colors.primary.main};
            color: ${theme.palette.primary.contrastText};
            box-shadow: ${theme.colors.shadows.primary};
            width: ${theme.spacing(4)};
            height: ${theme.spacing(4)};
            padding: 0;
        
            &:hover {
              background: ${theme.colors.primary.dark};
            }
          }
      `
    )



    return {
        AvatarWrapper,
        ButtonUploadWrapper,
        Input
    }
}