import { ReactNode, useState } from 'react';

import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import SourceTwoToneIcon from '@mui/icons-material/SourceTwoTone';
import SubjectTwoToneIcon from '@mui/icons-material/SubjectTwoTone';
import StackedBarChartTwoToneIcon from '@mui/icons-material/StackedBarChartTwoTone';
import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import SupervisorAccountTwoToneIcon from '@mui/icons-material/SupervisorAccountTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';
import TrendingDownTwoToneIcon from '@mui/icons-material/TrendingDownTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import ConstructionTwoToneIcon from '@mui/icons-material/ConstructionTwoTone';
import MediationTwoToneIcon from '@mui/icons-material/MediationTwoTone';

import { AddchartTwoTone } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import FolderCopyTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import AssignmentIcon from '@mui/icons-material/Assignment';


export interface MenuItem {
  id?: number;
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
  show: boolean
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',

    items: [
      {
        name: '',
        link: '/',
        icon: DashboardTwoToneIcon,
        items: [
          {
            id: 1,
            name: 'Home',
            link: '/',
            icon: HomeTwoToneIcon,
            show: true
          },
          {
            id: 2,
            //name: 'Administración de Obras',
            name: 'Toma de inventario',
            link: 'catalogos/tomaInventario',
            icon: EngineeringTwoToneIcon,
            show: true
          },
          // {
          //   id: 3,
          //   name: 'Captura de Gastos',
          //   link: 'procesos/capturaGastos',
          //   icon: TrendingDownTwoToneIcon,
          //   show: true
          // },
          // {
          //   id: 12,
          //   name: 'Captura de Ingresos',
          //   link: 'procesos/capturaIngresos',
          //   icon: PaymentsTwoToneIcon,
          //   show: true
          // }
        ],
        show: true
      }
    ]
  },
  // {
  //   heading: 'Configuración',
  //   items: [
  //     {
  //       name: 'Catálogos',
  //       icon: SourceTwoToneIcon,
  //       link: '',
  //       items: [
  //         {
  //           name: 'Generales',
  //           icon: SubjectTwoToneIcon,
  //           link: '',
  //           items: [
  //             // {
  //             //   id: 4,
  //             //   name: 'Obras',
  //             //   link: 'configuracion/obras',
  //             //   icon: StackedBarChartTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 10,
  //             //   name: 'Clientes',
  //             //   link: 'configuracion/clientes',
  //             //   icon: PeopleAltTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 5,
  //             //   name: 'Conceptos de Gastos',
  //             //   link: 'configuracion/conceptosgastos',
  //             //   icon: RequestQuoteTwoToneIcon,
  //             //   show: false
  //             // },
  //             // {
  //             //   id: 6,
  //             //   name: 'Colaboradores',
  //             //   link: 'configuracion/colaboradores',
  //             //   icon: SupervisorAccountTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 14,
  //             //   name: 'Grupos de Insumos',
  //             //   link: 'configuracion/gruposinsumos',
  //             //   icon: AddchartTwoTone,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 15,
  //             //   name: 'Insumos',
  //             //   link: 'configuracion/insumos',
  //             //   icon: MediationTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 16,
  //             //   name: 'Proveedores',
  //             //   link: 'configuracion/proveedores',
  //             //   icon: LocalShippingTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 8,
  //             //   name: 'Roles',
  //             //   link: 'configuracion/roles',
  //             //   icon: EngineeringTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 8,
  //             //   name: 'Conceptos de Pago',
  //             //   link: 'configuracion/tiposconceptopago',
  //             //   icon: ReceiptTwoToneIcon,
  //             //   show: true
  //             // },
  //             // {
  //             //   id: 13,
  //             //   name: 'Tipos de Insumos',
  //             //   link: 'configuracion/tiposinsumos',
  //             //   icon: ConstructionTwoToneIcon,
  //             //   show: false
  //             // },
  //             // {
  //             //   id: 18,
  //             //   name: 'Documentos',
  //             //   link: 'documentos/documentos',
  //             //   icon: FolderCopyTwoToneIcon,
  //             //   show: true
  //             // }
  //           ],
  //           show: false
  //         },
  //         // {
  //         //   id: 9,
  //         //   name: 'Empresas',
  //         //   link: 'configuracion/empresas',
  //         //   icon: BusinessTwoToneIcon,
  //         //   show: true
  //         // },
  //         // {
  //         //   id: 7,
  //         //   name: 'Usuarios',
  //         //   link: 'configuracion/usuarios',
  //         //   icon: ManageAccountsTwoToneIcon,
  //         //   show: true
  //         // }
  //       ],
  //       show: false
  //     },
  //   ]
  // },
  // {
  //   heading: 'REPORTES',

  //   items: [
  //     {
  //       name: 'Reportes',
  //       link: '/',
  //       icon: AssessmentIcon,
  //       items: [
  //         // {
  //         //   id: 16,
  //         //   name: 'Rep. Gastos por Obra',
  //         //   link: 'reportes/ReporteGastosObra',
  //         //   icon: FindInPageIcon,
  //         //   show: true
  //         // },
  //         // {
  //         //   id: 19,
  //         //   name: 'Rep. General Obras',
  //         //   link: 'reportes/ReporteGeneralObras',
  //         //   icon: AssignmentIcon,
  //         //   show: true
  //         // }
  //       ],
  //       show: false
  //     }
  //   ]
  // },
];

export default menuItems;
