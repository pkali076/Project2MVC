const helper = require('./helper.js');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }
    helper.sendPost(e.target.action, {username, pass, _csrf});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});

    return false;
}

const LoginWindow = (props) => {
    return(
        <section class="section">
            <div class="container">
                <div class="columns">
                    <div class="column">
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label class="label" htmlFor="username">Username: </label>
            <input class="input is-primary is-normal is-primary" id="user" type="text" name="username" placeholder="username" />
            <label class="label" htmlFor="pass">Password: </label>
            <input class="input is-primary is-normal is-primary" id="pass" type="password" name="pass" placeholder="password" />
            <input class="input is-primary is-normal is-primary" id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <button class="button is-primary is-medium" className="formSubmit" type="submit" value="Sign in" >Sign In</button>
        </form></div></div></div></section>
    );
};

const SignupWindow = (props) => {
    return(
        <section class="section">
            <div class="container">
                <div class="columns">
                <div class="column">
        <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm">
            <label class="label" htmlFor="username">Username: </label>
            <input class="input is-primary is-normal is-primary" id="user" type="text" name="username" placeholder="username" />
            <label class="label" htmlFor="pass">Password: </label>
            <input class="input is-primary is-normal is-primary" id="pass" type="password" name="pass" placeholder="password" />
            <label class="label" htmlFor="pass2">Password: </label>
            <input class="input is-primary is-normal is-primary" id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input class="input is-primary is-normal is-primary" id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <button class="button is-primary is-medium" className="formSubmit" type="submit" value="Sign in" >Sign Up</button>
        </form></div></div></div></section>
    );
}



const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });
    const burgerIcon = document.querySelector("#burger");
    const navbarMenu = document.querySelector("#nav-links");

    burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
    });

    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
};

window.onload = init;