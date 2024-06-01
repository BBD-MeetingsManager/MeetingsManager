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
                        window.location.href = homePageURL;
                    }))
            });
    }
    else {
        window.location.href = homePageURL;
    }

    return;
}

export default Redirect