import { Avatar, CardContent, styled } from "@mui/material";





 export const AvatarSuccess = styled(Avatar)(
    ({ theme } ) => `
        background-color: ${theme.colors.success.main};
        color: ${theme.palette.primary.contrastText};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};       
        box-shadow: ${theme.colors.shadows.success};
  `
  );
  
  export const AvatarPrimary = styled(Avatar)(
    ({ theme } ) => `
        background-color: ${theme.colors.primary.main};
        color: ${theme.palette.primary.contrastText};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
        box-shadow: ${theme.colors.shadows.primary};
  `
  );

  export const AvatarWarning = styled(Avatar)(
    ({ theme } ) => `
        background-color: ${theme.colors.warning.main};
        color: ${theme.palette.primary.contrastText};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
        box-shadow: ${theme.colors.shadows.warning};
  `
  );

  export const AvatarError = styled(Avatar)(
    ({ theme } ) => `
        background-color: ${theme.colors.error.main};
        color: ${theme.palette.primary.contrastText};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
        box-shadow: ${theme.colors.shadows.error};
  `
  );




  export const CardContentWrapper = styled(CardContent)(
    ({ theme }) => `
       padding: ${theme.spacing(2.5, 3, 3)};
    
       &:last-child {
       padding-bottom: 0;
       }
  `
  );