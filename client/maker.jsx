const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTexts = (e, onTextAdded) => {
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
            onSubmit={(e) => handleTexts(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className='textForm'
        >
            <label htmlFor='content'>Message: </label>
            <input id="textContent" type="text" name="content" />
            <input className='makeTextSubmit' type="submit" value="Send Message" />
        </form>
    );
};

const TextList = (props) => {
    const [texts, setText] = useState(props.text);

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
                <TextForm triggerReload={() => setReloadText(!reloadTexts)} />
            </div>
            <div id="texts">
                <TextList texts={[]} reloadTexts={reloadTexts} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;