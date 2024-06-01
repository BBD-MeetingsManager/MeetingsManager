const SignOut = () => {
    const homePageURL = 'http://localhost:5173';

    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');

    window.location.href = homePageURL;

    return;
}

export default SignOut