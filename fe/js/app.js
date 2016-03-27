/* jslint browser: true, browserify: true */

function round(num) {
    return Math.round(num * 1000000) / 1000000;
}

/**
 * Randomly selects a cause based on provided probabilities.
 */
function pickCause(causes) {
    var total_pct = causes.reduce(function (total, cause) {
        return total + cause.pct;
    }, 0);

    var choice = Math.random() * total_pct;

    for (var i = 0; i < causes.length; i++) {
        choice -= causes[i].pct;
        if (choice <= 0.000000001) {
            return causes[i];
        }
    }

    return {
        name: 'a programming error',
        description: 'Just kidding. This actually just means I made a mistake.',
        pct: 0.0,
        deaths: 0,
    };
}

function updateAll(selector, value) {
    var all = document.querySelectorAll(selector);

    for (var i = 0; i < all.length; i++) {
        all[i].innerHTML = value;
    }
}

function render() {
    function toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    var person = JSON.parse(this.responseText);

    var causes = require('./causes');
    var cause = pickCause(causes);

    document.getElementById('user-image').src = person.results[0].user.picture.medium;
    document.getElementById('donate').href = cause.donation;
    updateAll('.name', toUpper(person.results[0].user.name.first));
    updateAll('.cause', cause.name);
    updateAll('.percent', round(cause.pct * 100) + '%');
    updateAll('.deaths', cause.deaths.toLocaleString());
    updateAll('#details', cause.description);

    var body = document.querySelector('body');
    body.classList.add('fadein');
    body.style.opacity = 1;
}

window.addEventListener('load', function () {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", render);
    xhr.open('GET', 'https://randomuser.me/api/?nat=us');
    xhr.send();
});