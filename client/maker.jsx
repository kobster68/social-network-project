const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleText = (e, onTextAdded) => {
    e.preventDefault();
    helper.hideError();

    const content = e.target.querySelector('#textContent').value;

    if(!content) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {content}, onTextAdded);
    return false;
}

const TextForm = (props) => {
    return (
        <form id="textForm"
            name="textForm"
            onSubmit={(e) => handleText(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className='textForm'
        >
            <label htmlFor='content'>Message: </label>
            <input id="textContent" type="text" name="content" />
            <input className='makeTextSubmit' type="submit" value="Send Text" />
        </form>
    );
};

const TextList = (props) => {
    const [texts, setTexts] = useState(props.texts);

    useEffect(() => {
        const loadTextsFromServer = async () => {
            const response = await fetch('/getTexts');
            const data = await response.json();
            setTexts(data.texts);
        };
        loadTextsFromServer();
    }, [props.reloadTexts]);

    if(texts.length === 0) {
        return (
            <div className="textList">
                <h3 className="emptyText">No Messages Yet!</h3>
            </div>
        );
    }

    const textNodes = texts.map(text => {
        return (
            <div key={text.id} className='text'>
                <button onClick={() => {
                    const owner = text.owner;
                    helper.sendPost("/follow", {owner});
                    const loadTextsFromServer = async () => {
                        const response = await fetch('/getTexts');
                        const data = await response.json();
                        setTexts(data.texts);
                    };
                    loadTextsFromServer();
                }}>Follow</button>
                {/* <img src="/assets/img/textface.jpeg" alt="text face" className="textFace" /> */}
                <h3 className="textName">@{text.name}</h3>
                <h3 className="textContent">Message: {text.content}</h3>
            </div>
        );
    });

    return (
        <div className="textList">
            {textNodes}
        </div>
    );
};

const App = () => {
    const [reloadTexts, setReloadTexts] = useState(false);

    return (
        <div>
            <div id="makeText">
                <TextForm triggerReload={() => setReloadTexts(!reloadTexts)} />
            </div>
            <div id="texts">
                <TextList texts={[]} reloadTexts={reloadTexts} />
            </div>
        </div>
    );
};

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

const AccountWindow = () => {
    return (
        <div>
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
            <div id="checkboxes">
                <label for="private">Mark account as private: </label>
                <input type="button" id="private" name="private" value="Toggle" onClick={() => {
                    helper.sendPost("/togglePrivate", {});
                }}/>
                <br></br>
                <label for="premium">Mark account as premium: </label>
                <input type="button" id="premium" name="premium" value="Toggle" onClick={() => {
                    helper.sendPost("/togglePremium", {});
                }}/>
            </div>
        </div>
    );
};

const init = () => {
    const mainButton = document.getElementById('mainButton');
    const accountButton = document.getElementById('accountButton');

    const root = createRoot(document.getElementById('app'));

    mainButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <App /> );
        return false;
    });

    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <AccountWindow /> );
        return false;
    });

    root.render( <App /> );
};

window.onload = init;