import { useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  styled
} from '@mui/material';
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';


const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(0)};
        color: ${theme.colors.alpha.trueWhite[70]};

        &:hover {
          color: ${theme.colors.alpha.trueWhite[100]};
        }
`
)

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
)

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
)

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
)

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
)

const HeaderUserbox = () =>  {
  const location = useLocation();
  const navigate = useNavigate();
  const {authState, authLocalState, logout} = useAuth()
  const {user} = (authState.user) ? authState : authLocalState

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      component="span"
      sx={{
        display: { xs: 'none', sm: 'inline-block' }
      }}
    >
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar alt={user.nombre} src={user.avatar} />
        <ExpandMoreTwoToneIcon
          fontSize="small"
          sx={{
            ml: 0.5
          }}
        />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar variant="rounded" alt={user.nombre} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.nombre}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user.role}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem
            button
            onClick={() => {
              handleClose();
            }}
            to={`/site/configuracion/usuarios/perfil`}
            component={NavLink}
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={'Perfil'} />
          </ListItem>
          {/* <ListItem
            button
            onClick={() => {
              handleClose();
            }}
            to={`/${
              location.pathname.split('/')[1]
            }/applications/mailbox/inbox`}
            component={NavLink}
          >
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary={'Inbox'} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleClose();
            }}
            to={`/${
              location.pathname.split('/')[1]
            }/applications/projects-board`}
            component={NavLink}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={'Projects'} />
          </ListItem> */}
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {'Salir'}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default HeaderUserbox;
