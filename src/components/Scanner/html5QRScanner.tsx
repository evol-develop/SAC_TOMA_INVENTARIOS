import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const ScannerHTML = () => {
  useEffect(() => {
    //declarar scanner pero sin estar escaneando continuamente
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: {
            width: 750,
            height: 240
        }
      },
      true
    );

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(qrCodeMessage) {
      alert(qrCodeMessage);
    }

    function onScanError(errorMessage) {
    }
  }, []);

  return (
      <div id="reader"></div>
  );
};
