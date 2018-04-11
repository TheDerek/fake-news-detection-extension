let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.executeScript(
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
// };

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

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

let startTime = new Date().getTime();

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let url = encodeURIComponent(tabs[0].url);

    fetch(`http://127.0.0.1:5000/get/${url}`)
        .then(
            function(response) {
                let loadTime = (new Date().getTime() - startTime);
                let waitTime = minimumWaitTime - loadTime;
                waitTime = Math.max(0, waitTime);

                // Wait a certain amount of time before revealing the answer for UX reasons
                sleep(waitTime).then(() => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        console.log(data);
                        if (data['category'] === 'fake') {
                            setFakeNews()
                        }

                        if (data['category'] === 'real') {
                            setRealNews();
                        }
                        //document.getElementById('response').textContent = data;
                    });
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
            setError(err);
        });
});




// let xhr = new XMLHttpRequest();
//
// xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1", false);
// xhr.send();
//
// let result = xhr.responseText;
// document.getElementById('response').textContent = result;