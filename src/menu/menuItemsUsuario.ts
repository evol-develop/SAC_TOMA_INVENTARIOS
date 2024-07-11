import { ReactNode } from 'react';

import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import SourceTwoToneIcon from '@mui/icons-material/SourceTwoTone';
import SubjectTwoToneIcon from '@mui/icons-material/SubjectTwoTone';
import StackedBarChartTwoToneIcon from '@mui/icons-material/StackedBarChartTwoTone';
import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import SupervisorAccountTwoToneIcon from '@mui/icons-material/SupervisorAccountTwoTone';

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


const menuItemsUsuario: MenuItems[] = [
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
            name: 'Administracion de Obras',
            link: 'procesos/administracionObras',
            icon: EngineeringTwoToneIcon
          },
          {
            name: 'Captura de Gastos',
            link: 'procesos/capturaGastos',
            icon: RequestQuoteTwoToneIcon
          }
        ]
      }
    ]
  },
  {
    heading: 'Configuración',
    items: [
      {
        name: 'Catálogos',
        icon: SourceTwoToneIcon,
        link: '',
        items: [
          {
            name: 'Generales',
            icon: SubjectTwoToneIcon,
            link: '',

            items: [
              {
                name: 'Obras',
                link: 'configuracion/obras',
                icon: StackedBarChartTwoToneIcon
              },
              {
                name: 'Conceptos de Gastos',
                link: 'configuracion/conceptosgastos',
                icon: RequestQuoteTwoToneIcon
              },
              {
                name: 'Colaboradores',
                link: 'configuracion/colaboradores',
                icon: SupervisorAccountTwoToneIcon
              },
              {
                name: 'Roles',
                link: 'configuracion/roles',
                icon: SupervisorAccountTwoToneIcon
              }
            ]
          },
          {
            name: 'Usuarios',
            link: 'configuracion/usuarios',
            icon: ManageAccountsTwoToneIcon
          }
        ]
      }
    ]
  }
];



export default menuItemsUsuario;
