const helper = require('./helper.js');


const ChangePasswordWindow = (props) => {
    return(
        <form id="changePassForm"
        name="changePassForm"
        onSubmit={handlePassChange}
        action="/passChange"
        method="POST"
        className="mainForm">
                <label htmlFor="newPass">New Password: </label>
                <input id="oldPass" type="password" name="oldPass" placeholder="current password" />
                <label htmlFor="newPass">New Password: </label>
                <input id="newPass" type="password" name="newPass" placeholder="retype new password" />
                <input id="_csrf" type="hidden" name="_csrf" value="{props.csrf}" />
                <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
}

const handlePassChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector("#oldPass").value;
    const newPass = e.target.querySelector("#newPass").value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!oldPass || !newPass){
        helper.handleError('One of the Passwords is Empty!');
        return false;

    }
    helper.sendPost(e.target.action, {oldPass, newPass, _csrf});

    return false;
}

const init = async() => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const passChangeButton = document.getElementById('passChangeButton');

    passChangeButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<ChangePasswordWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        //return false;
    });
};
window.onload = init;