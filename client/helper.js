const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('infoMessage').classList.remove('hidden');
    checkPremium();
};

const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('infoMessage').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
    checkPremium();
};

const checkPremium = async () => {
  const response = await fetch('/getPremium');
  const data = await response.json();
  if(data.premium) {
    document.getElementById('ad').classList.add('hidden');
  } else {
    document.getElementById('ad').classList.remove('hidden');
  }
}

const hideError = () => {
    document.getElementById('infoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
    checkPremium,
}