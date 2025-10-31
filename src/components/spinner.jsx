import { FaSpinner } from "react-icons/fa";
import { ImSpinner11, ImSpinner2, ImSpinner3, ImSpinner8 } from "react-icons/im";

export default function Spinner({type = 'bars', size = 30, speed = 1}) {

    const spinnerTypes = {
        bars: <ImSpinner3 />,
        dots: <FaSpinner />,
        ring: <ImSpinner8 />,
        snake: <ImSpinner2 />,
        arrow: <ImSpinner11 />
    };

    return (
        <div className="spinner animate-spin w-fit h-fit absolute inset-0 m-auto" style={{ fontSize: size, animationDuration: `${1 / speed}s` }}>
            {spinnerTypes[type]}
        </div>
    );
}
