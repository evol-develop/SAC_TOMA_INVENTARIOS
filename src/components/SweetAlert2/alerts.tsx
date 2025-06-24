import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export function ToastCompletado(
  texto: string,
  titulo: string = 'Atención',
  onConfirm: any = null
) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    customClass: {
      popup: 'toast-zindex'
    },
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: 'success',
    title: texto
  });
}

export function ToastError(texto: string, tiempo: number = 3000) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: tiempo,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.style.zIndex = '9999';
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: 'error',
    title: texto
  });
}
