const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, pass2});

    return false;
}

const AccountWindow = (props) => {
    return (
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handlePasswordChange}
            action="/changePassword"
            method="POST"
            className='mainForm'
        >
            <label htmlFor='pass'>Password: </label>
            <input id="pass" type="password" name="pass" placeholder='password'/>
            <label htmlFor='pass'>Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder='retype password'/>
            <input className='formSubmit' type="submit" value="Change Password" />
        </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('account'));

    root.render( <AccountWindow /> );
};

window.onload = init;