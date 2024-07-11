import { ReactNode } from 'react';

import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItemsUsuarioSINCatalogos: MenuItems[] = [
  {
    heading: '',

    items: [
      {
        name: '',
        link: '/',
        icon: DashboardTwoToneIcon,
        items: [
          {
            name: 'Home',
            link: '/',
            icon: HomeTwoToneIcon
          },
          {
            name: 'Captura de Gastos',
            link: 'procesos/capturaGastos',
            icon: RequestQuoteTwoToneIcon
          }
        ]
      }
    ]
  }
];

export default menuItemsUsuarioSINCatalogos;