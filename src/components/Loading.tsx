import { useEffect, useState } from "react";
import styles from "../styles/Loading.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Loading(): JSX.Element {
  const [color, setColor] = useState("#fff");
  const darkLightToggle = useSelector((state: RootState) => state.darkLight);

  useEffect(() => {
    if (darkLightToggle === "dark") {
      setColor("#fff");
    } else if (darkLightToggle === "light") {
      setColor("#000");
    }
  }, [darkLightToggle]);

  return (
    <div className={styles.loaderContainer}>
      <svg
        className={styles.loader}
        version="1.1"
        id="L4"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
      >
        <circle fill={color} stroke="none" cx="6" cy="50" r="6">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
        </circle>
        <circle fill={color} stroke="none" cx="26" cy="50" r="6">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
        </circle>
        <circle fill={color} stroke="none" cx="46" cy="50" r="6">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
        </circle>
      </svg>
    </div>
  );
}
