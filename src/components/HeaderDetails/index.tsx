import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../PageTitleWrapper';
import PageHeader from './PageHeader';

export default function HeaderDetils(props: HeaderDetilsProps) {
  return (
    <>
      <Helmet>
        <title>Report</title>
      </Helmet>
        <PageHeader
          titulo={props.titulo}
          descripcion={props.descripcion}
          item={props.item}
          titulo2={props.titulo2}
          descripcion2={props.descripcion2}
        />
    </>
  );
}

interface HeaderDetilsProps {
  titulo: string;
  descripcion: string;
  item: any;
  titulo2?: string;
  descripcion2?: string;
}
