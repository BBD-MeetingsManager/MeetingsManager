import {paths} from "../enums/paths.tsx";

const Redirect = () => {
    const homePageURL = 'http://localhost:5173';

    if (!localStorage.getItem('id_token')) {
        const baseURL = 'http://localhost:8080';
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        fetch(`${baseURL}/auth/getAccessToken?code=${code}`)
            .then((result) => {
                result.json()
                    .then(((response) => {
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
                                    window.location.href = homePageURL;
                                }));
                    }))
            });
    }
    else {
        window.location.href = homePageURL;
    }

    return;
}

export default Redirect