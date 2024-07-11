import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Authenticated from 'src/components/authenticated/Authenticated';
import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';

const Loader = (Component) => (props) => (
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

// login
const LoginBasic = Loader(lazy(() => import('src/content/login/Basic')))

// index
const Index = Loader(lazy(() => import('src/content/index/Index')))

//configuracion
const ManagementUsers = Loader(lazy(() => import('src/content/Users/index')))
const PerfilUsuario = Loader(lazy(() => import('src/content/Users/perfil/index')))
const ManagementEmpresas = Loader(lazy(() => import('src/content/catalogos/empresas/index')))
const TomaInventario = Loader(lazy(() => import('src/content/catalogos/tomaInventario/index')))

//catalogos generales

// procesos
// const ManagementAdmonObras = Loader(lazy(() => import('src/content/procesos/administracionObras/index')))
// const ObrasInfoDetalles = Loader(lazy(() => import('src/content/procesos/administracionObras/ObrasInfoDetalles')))
// const CapturaGastos = Loader(lazy(() => import('src/content/procesos/capturaGastos/index')))
// const CapturaIngresos = Loader(lazy(() => import('src/content/procesos/capturaIngresos/index')))

// reportes
const ReporteGastosObra = Loader(lazy(() => import('src/content/reportes/repGastosByObra/index')))
const ReporteGeneralObras = Loader(lazy(() => import('src/content/reportes/repGeneralObras/index')))

// Status
const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));

const routes: PartialRouteObject[] = [
    {
        path: '*',
        element: <BaseLayout />,
        children: [
            {
                path: '/login',
                element: <LoginBasic />
            },
            {
                path: '/',
                element: <LoginBasic />
            },
            {
                path: 'login',
                element: (
                    <Navigate
                        to="/"
                        replace
                    />
                )
            },
            {
                path: 'status',
                children: [
                    {
                        path: '/',
                        element: (
                            <Navigate
                                to="404"
                                replace
                            />
                        )
                    },
                    {
                        path: '404',
                        element: <Status404 />
                    },
                    {
                        path: '500',
                        element: <Status500 />
                    },
                    {
                        path: 'maintenance',
                        element: <StatusMaintenance />
                    },
                    {
                        path: 'coming-soon',
                        element: <StatusComingSoon />
                    },
                ]
            },
            {
                path: '*',
                element: <Status404 />
            },
        ]
    },
    {
        path: 'site',
        element: (
            <Authenticated>
                {/* <AccentHeaderLayout /> */}
                <SidebarLayout />
            </Authenticated>
        ),
        children: [
            {
                path: '/',
                element: (
                    <Navigate
                        to="/site/index"
                        replace
                    />
                )
            },
            {
                path: 'index',
                element: <Index />
            },
            {
                path: 'catalogos/tomaInventario',
                element: <TomaInventario />
            },
            // {
            //     path: 'procesos/ObrasInfoDetalles/:id',
            //     element: <ObrasInfoDetalles />
            // },
            // {
            //     path: 'procesos/capturaGastos',
            //     element: <CapturaGastos />
            // },
            // {
            //     path: 'procesos/capturaIngresos',
            //     element: <CapturaIngresos />
            // }
        ]
    },
    {
        path: 'site',
        element: (
            <Authenticated>
                {/* <AccentHeaderLayout /> */}
                <SidebarLayout />
            </Authenticated>
        ),
        children: [
            {
                path: 'configuracion/usuarios',
                element: <ManagementUsers />
            },
            {
                path: 'configuracion/usuarios/perfil',
                element: <PerfilUsuario />
            },
            {
                path: 'configuracion/empresas',
                element: <ManagementEmpresas />
            },
            // {
            //     path: 'configuracion/clientes',
            //     element: <ManagementClientes />
            // },
            // {
            //     path: 'configuracion/obras',
            //     element: <ManagementObras />
            // },
            // {
            //     path: 'configuracion/conceptosgastos',
            //     element: <ManagementConceptosGastos />
            // },
            // {
            //     path: 'configuracion/colaboradores',
            //     element: <ManagementColaboradores />
            // },
            // {
            //     path: 'configuracion/roles',
            //     element: <ManagementRoles />
            // },
            // {
            //     path: 'configuracion/tiposconceptopago',
            //     element: <ManagementTipoConceptoPago />
            // },
            // {
            //     path: 'configuracion/tiposinsumos',
            //     element: <ManagementTiposInsumos />
            // },
            // {
            //     path: 'configuracion/gruposinsumos',
            //     element: <ManagementGruposInsumos />
            // },
            // {
            //     path: 'configuracion/insumos',
            //     element: <ManagementInsumos />
            // },
            // {
            //     path: 'documentos/documentos',
            //     element: <ManagementDocumentos />
            // },
            // {
            //     path: 'configuracion/proveedores',
            //     element: <ManagementProveedores />
            // },

            // REPORTES ------------------------------------------------------
            {
                path: 'reportes/ReporteGastosObra',
                element: <ReporteGastosObra />
            },
            {
                path: 'reportes/ReporteGeneralObras',
                element: <ReporteGeneralObras />
            },
        ]
    },
];

export default routes;