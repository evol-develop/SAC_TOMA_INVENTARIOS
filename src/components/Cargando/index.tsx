import ClipLoader from "react-spinners/ClipLoader";

export default function Cargando(props: cargandoProps) {
  const size = "2vw";

  if (props.spinnerType === "clip") {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ClipLoader color={props.color} loading={props.isLoading} size={size} />
      </div>
    );
  } else {
    return <></>;
  }
}

interface cargandoProps {
  isLoading: boolean;
  size?: number;
  color?: string;
  spinnerType: "clip";
}

Cargando.defaultProps = {
  spinnerType: "clip",
  size: 100,
  color: "blue",
  isLoading: true,
  paddingLeft: "35vw"
};