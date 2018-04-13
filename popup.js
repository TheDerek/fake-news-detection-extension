let changeColor = document.getElementById('changeColor');

let minimumWaitTime = 1500;
let errorMsg = document.getElementById('error-msg');
let loading = document.getElementById('loading');
let realNews = document.getElementById('real-news');
let fakeNews = document.getElementById('fake-news');
let errorNews = document.getElementById('error-news');

function setRealNews() {
    loading.style.display = 'none';
    realNews.style.display = 'block';
}

function setFakeNews() {
    loading.style.display = 'none';
    fakeNews.style.display = 'block';
}

function setError(msg) {
    loading.style.display = 'none';
    errorNews.style.display = 'block';
    errorMsg.textContent = msg;
}

function sleep (startTime, response) {
    return new Promise((resolve) => {
        let loadTime = (new Date().getTime() - startTime);
        let waitTime = minimumWaitTime - loadTime;


        setTimeout(() => resolve(response), waitTime)
    });
}

function acceptResponse(response) {
    return new Promise((resolve, reject) => {
        if (response.status !== 200) {
            reject(`Looks like there was a problem. Status Code: ${response.status}`)
        } else {
            resolve(response)
        }
    });
}

function parseData(data) {
    if(!data['is_article']) {
        setError('No article found.');
        return
    }

    if (data['category'] === 'fake') {
        setFakeNews()
    }

    if (data['category'] === 'real') {
        setRealNews();
    }
}

let startTime = new Date().getTime();

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let url = encodeURIComponent(tabs[0].url);

    fetch(`http://127.0.0.1:5000/get/${url}`)
        .then(response => sleep(startTime, response))
        .then(response => acceptResponse(response))
        .then(response => response.json())
        .then(data => parseData(data))
        .catch(err => {
            console.log('Fetch Error :-S', err);
            setError(err);
        });
});