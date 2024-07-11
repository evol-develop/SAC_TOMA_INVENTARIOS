
import { Avatar, Button, Dialog, Tabs, styled, Card, Slide, Box } from '@mui/material';
import { forwardRef } from 'react'

export const Styled = () => {

  const DialogWrapper = styled(Dialog)(
    () => `
            .MuiDialog-paper {
              overflow: visible;
            }
      `
  );

  const AvatarError = styled(Avatar)(
    ({ theme }) => `
            background-color: ${theme.colors.error.lighter};
            color: ${theme.colors.error.main};
            width: ${theme.spacing(12)};
            height: ${theme.spacing(12)};
      
            .MuiSvgIcon-root {
              font-size: ${theme.typography.pxToRem(45)};
            }
      `
  );

  const CardWrapper = styled(Card)(
    ({ theme }) => `
      
        position: relative;
        overflow: visible;
      
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: inherit;
          z-index: 1;
          transition: ${theme.transitions.create(['box-shadow'])};
        }
            
          &.Mui-selected::after {
            box-shadow: 0 0 0 3px ${theme.colors.primary.main};
          }
        `
  );

  const ButtonError = styled(Button)(
    ({ theme }) => `
           background: ${theme.colors.error.main};
           color: ${theme.palette.error.contrastText};
      
           &:hover {
              background: ${theme.colors.error.dark};
           }
          `
  );

  const TabsWrapper = styled(Tabs)(
    ({ theme }) => `
          @media (max-width: ${theme.breakpoints.values.md}px) {
            .MuiTabs-scrollableX {
              overflow-x: auto !important;
            }
      
            .MuiTabs-indicator {
                box-shadow: none;
                
            }
          }
          `
  );

  const Transition = forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="down" ref={ref} {...props} />;
  });




  const Input = styled('input')({
    display: 'none'
  });


  const ButtonUploadWrapper = styled(Box)(
    ({ theme }) => `
  

  .MuiIconButton-root {
    border-radius: 100%;
    background: ${theme.colors.primary.main};
    color: ${theme.palette.primary.contrastText};
    box-shadow: ${theme.colors.shadows.primary};
    width: ${theme.spacing(3)};
    height: ${theme.spacing(3)};
    padding: 0;

    &:hover {
      background: ${theme.colors.primary.dark};
    }
  }
`
  );



  return {
    DialogWrapper,
    AvatarError,
    CardWrapper,
    ButtonError,
    TabsWrapper,
    Transition,
    Input,
    ButtonUploadWrapper
  }
}
