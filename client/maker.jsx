const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const content = e.target.querySelector('#domoContent').value;

    if(!content) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {content}, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className='domoForm'
        >
            <label htmlFor='content'>Message: </label>
            <input id="domoContent" type="text" name="content" />
            <input className='makeDomoSubmit' type="submit" value="Send Message" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <button onClick={() => {
                    const owner = domo.owner;
                    helper.sendPost("/follow", {owner});
                    const loadDomosFromServer = async () => {
                        const response = await fetch('/getDomos');
                        const data = await response.json();
                        setDomos(data.domos);
                    };
                    loadDomosFromServer();
                }}>Follow</button>
                {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> */}
                <h3 className="domoName">@{domo.name}</h3>
                <h3 className="domoContent">Message: {domo.content}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;