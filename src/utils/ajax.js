const Promise = require('es6-promise').Promise;

/**
 * Ajax GET
 * @param param
 * @returns {Promise}
 * @constructor
 */
let AjaxGet = function(param={ url: '', data: {} }) {
    return new Promise(
        function(resolve, reject) {
            Ajax(resolve, reject, 'GET', param.url + '?' + buildParam(param.data));
        }
    )
};

/**
 * Ajax POST
 * @param param
 * @returns {Promise}
 * @constructor
 */
let AjaxPost = function(param={ url: '', data: {} }) {
    return new Promise(function(resolve, reject) {
        Ajax(resolve, reject, 'POST', param.url, param.data);
    })
};

let Ajax = function(resolve, reject, method = 'GET', url = '', data = {}) {
    let xhr = new XMLHttpRequest();
    if (url === '') {
        throw new Error('Ajax need url')
    }
    xhr.open(method, url, true);
    xhr.withCredentials = true;
    xhr.addEventListener("load", function () {
        resolve(xhr.response);
    });
    xhr.addEventListener("error", function (e) {
        reject(e);
    });
    if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(buildParam(data));
    } else {
        xhr.send();
    }
};

/**
 * build url param
 * @param data
 * @returns {string}
 */
function buildParam(data={}) {
    let params = [];
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            params.push(k + '=' + data[k]);
        }
    }
    return params.join('&')
}

export default {
    post: AjaxPost,
    get: AjaxGet
};