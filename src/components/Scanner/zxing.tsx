import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          // Detener el stream inmediatamente ya que solo estamos pidiendo permiso
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        } catch (error) {
          alert("Error accediendo a la cámara: " + error);
          setError("No se pudo acceder a la cámara. Por favor, verifica los permisos y configura tu navegador.");
        }
      } else {
        alert("getUserMedia no es compatible con este navegador.");
        setError("getUserMedia no es compatible con este navegador.");
      }
    };

    requestCameraPermission();
  }, []);

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {hasPermission ? (
            <>
              <video ref={ref} />
              <p>
                <span>Last result:</span>
                <span>{result}</span>
              </p>
            </>
          ) : (
            <p>Solicitando permiso para acceder a la cámara...</p>
          )}
        </>
      )}
    </>
  );
};
