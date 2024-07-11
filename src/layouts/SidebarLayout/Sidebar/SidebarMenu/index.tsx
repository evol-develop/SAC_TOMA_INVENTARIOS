import { ListSubheader, List } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import SidebarMenuItem from './item';
import menuItems, { MenuItem, MenuItems } from '../../../../menu/menuItems';
import { styled } from '@mui/material/styles';
import menuItemsUsuario from 'src/menu/menuItemsUsuario';
import useAuth from 'src/hooks/useAuth';
import { Permisos, RolestType } from 'src/interfaces/userInterface';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import menuItemsUsuarioSINCatalogos from '../../../../menu/menuItemsUsuarioSINCatalogos';
import { useEffect, useState } from 'react';

const MenuWrapper = styled(List)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(2)} ${theme.spacing(2)};
    }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.sidebar.menuItemHeadingColor};
      padding: ${theme.spacing(0.8, 2)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(List)(
  ({ theme }) => `
    &.MuiList-root {
      padding: 0;

      .MuiList-root .MuiList-root .MuiListItem-root .MuiButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 2px ${theme.spacing(2)};
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          font-size: ${theme.typography.pxToRem(13)};
          padding-top: ${theme.spacing(0.8)};
          padding-bottom: ${theme.spacing(0.8)};
          position: relative;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(4)};

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(9)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(26)};
            margin-right: ${theme.spacing(1.5)};
            color: ${theme.sidebar.menuItemIconColor};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            font-size: ${theme.typography.pxToRem(22)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;
          line-height: 1;
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px ${theme.spacing(0)};

            .MuiButton-root {
              font-size: ${theme.typography.pxToRem(13)};
              padding: ${theme.spacing(0.5, 2, 0.5, 6.5)};

              &.Mui-active,
              &:hover {
                background-color: ${theme.sidebar.menuItemBg};
              }
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({
  items,
  path
}: {
  items: MenuItem[];
  path: string;
}): JSX.Element => (
  <SubMenuWrapper>
    {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
  </SubMenuWrapper>
);

const reduceChildRoutes = ({
  ev,
  path,
  item
}: {
  ev: JSX.Element[];
  path: string;
  item: MenuItem;
}): Array<JSX.Element> => {
  const key = item.name;

  const exactMatch = item.link
    ? !!matchPath(
        {
          path: item.link,
          end: true
        },
        path
      )
    : false;

  if (item.items) {
    const partialMatch = item.link
      ? !!matchPath(
          {
            path: item.link,
            end: false
          },
          path
        )
      : false;

    if (item.show) {
      ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
        >
          {renderSidebarMenuItems({
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
  } else {
    if (item.show) {
      ev.push(
        <SidebarMenuItem
          key={key}
          active={exactMatch}
          name={item.name}
          link={item.link}
          badge={item.badge}
          icon={item.icon}
        />
      );
    }
  }

  return ev;
};

const SidebarMenu = () => {
  const location = useLocation();
  const { authLocalState, authState } = useAuth();
  const permisos = useAppSelector(
    (state: RootState) => state.permisos.slots.PERMISOS
  );

  // const menu = ((authLocalState  && authLocalState.user.infoAdicional.userRol === 'SUPER-ADMIN')   )
  //           ? menuItemsUsuario
  //           : menuItems

  //let menu = menuItems;
  const [menu, setMenu] = useState(menuItems);

  const [MenuBien, setMenuBien] = useState<MenuItems[]>();

  useEffect(() => {
    //console.log('permisos', authLocalState);

    //if (authLocalState.user.role === 'SuperAdmin') {
    if (authLocalState.user.role === '4') {

      menu.map((elemento: any) => {
        if (elemento.id === 2) {
          elemento.show = true;
        }
      });

      setMenuBien([...menu]);
    } else {
      if (permisos) {
        RecorreElementos(menu);
        setMenuBien([...menu]);
      }
    }
  }, [permisos]);

  const ContieneItems = (item: any) => {
    return item.hasOwnProperty('items') && Array.isArray(item.items);
  };

  const RecorreElementos = (menu: any) => {
    menu.map((elemento: any) => {
      if (ContieneItems(elemento)) {
        RecorreElementos(elemento.items);
      } else {
        permisos?.map((item) => {
          if (item.id === elemento.id) {
            if (!item.acceso) {
              elemento.show = false;
            }
          }

          if (elemento.id === 9) {
            elemento.show = false;
          }
        });
      }
    });
  };

  // Filtrar el menú original para mantener solo los elementos con acceso = true

  // switch (authLocalState.user.role) {
  //   case "SUPER-ADMIN":
  //     menu = menuItems
  //     break
  //   case "Administrador":
  //     menu = menuItemsUsuario
  //     break
  //   case "Usuario":
  //     menu = menuItemsUsuarioSINCatalogos
  //     break
  // }

  return (
    <>
      {MenuBien?.map((section) => (
        <MenuWrapper
          key={section.heading}
          subheader={
            <ListSubheader component="div" disableSticky>
              {section.heading}
            </ListSubheader>
          }
        >
          {renderSidebarMenuItems({
            items: section.items,
            path: location.pathname
          })}
        </MenuWrapper>
      ))}
    </>
  );
};

export default SidebarMenu;
