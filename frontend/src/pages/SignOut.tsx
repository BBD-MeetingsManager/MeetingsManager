import {useNavigate} from "react-router-dom";
import React from "react";
import {paths} from "../enums/paths.tsx";


const SignOut = () => {
    const navigate = useNavigate();

    React.useEffect(
        () => {
            localStorage.removeItem('id_token');
            localStorage.removeItem('refresh_token');

            navigate(paths.landingPage);
        },
        [navigate]
    );

    return null;
}

export default SignOut