
import { useNavigate } from 'react-router-dom';
import {paths} from "../enums/paths.tsx";

const Redirect = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('id_token');
    if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        fetch(`${paths.ec2InstanceLocal}/auth/getAccessToken?code=${code}`)
            .then((result) => {
                result.json()
                    .then(((response) => {
                        if (response.id_token){
                            localStorage.setItem('id_token', response.id_token);
                            localStorage.setItem('refresh_token', response.refresh_token);

                            // Register user on DB
                            const url = `${paths.apiUrlLocal}/user/login`;
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${response.id_token}`,
                                }
                            };

                            fetch(url, options)
                                .then(result => result.json()
                                    .then(asJson => {
                                        console.log("db registration response", asJson);
                                        navigate(paths.home);
                                    }));
                        }

                        navigate(paths.home);
                    }))
            });
    }
    else {
        navigate(paths.home);
    }

    return null;
}

export default Redirect
