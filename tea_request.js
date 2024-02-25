import ffi from "ffi-napi"
import { fileURLToPath } from "url";
import path from "path";
import os from'os';
console.log(os.arch());
console.log(os.platform());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let dlName = "mektls"
if (os.platform()==="darwin" && os.arch() === "arm64"){
    dlName = "mektlsarm64"
}

export const mek_tls = {
    tlsClientLibrary : ffi.Library(path.join(__dirname, './dist/'+dlName), {
        'request': ['string', ['string']],
        'getCookiesFromSession': ['string', ['string']],
        'addCookiesToSession': ['string', ['string']],
        'freeMemory': ["void", ['string']],
        'destroyAll': ['string', []],
        'destroySession': ['string', ['string']]
    }),

    request: async function request(url, options) {
        let DefaultOptions = {
            "tlsClientIdentifier": "chrome_103",
            "followRedirects": true,
            "insecureSkipVerify": false,
            "withoutCookieJar": false,
            "withDefaultCookieJar": false,
            "isByteRequest": false,
            "additionalDecode": null,
            "forceHttp1": false,
            "withRandomTLSExtensionOrder": true,
            "timeoutSeconds": 30,
            "timeoutMilliseconds": 0,
            "sessionId": "",
            "proxyUrl": "",
            "isRotatingProxy": false,
            "certificatePinningHosts": {},
            "headers": {},
            "headerOrder": [],
            "requestUrl": url,
            "requestMethod": "",
            "requestBody": "",
            "requestCookies": []
        }

        Object.assign(DefaultOptions, options)
        options = DefaultOptions

        options.headerOrder = Object.keys(options.headers)

        // validation
        options["requestMethod"] = options["requestMethod"].toUpperCase()
        const validMethods = ["GET", "POST", "FORM", "PUT", "PUTFORM", "HEAD"];
        if (!validMethods.includes(options["requestMethod"])) {
            return new Error("Method must be either GET, POST, FORM, PUT, HEAD or PUTFORM.")
        }
        if (Number.isNaN(options["timeoutSeconds"])) {
            return new Error("timeoutSeconds must be a number.")
        }
        if (options["requestMethod"] === "GET" && options["requestBody"] !== '') {
            return new Error("Get requests can not have bodies.");
        }
        return new Promise((resolve) => {
            this.tlsClientLibrary.request.async(JSON.stringify(options), (error, response) => {
                const clientResponse = JSON.parse(response);

                resolve(clientResponse);
            })
        })
    },

    destroySession:async function destroySession(sessionId) {
        if (sessionId === "") {
            return new Error("sessionId can not be empty");
        }
        let response = await this.tlsClientLibrary.destroySession(JSON.stringify({sessionId}))
        return JSON.parse(response)
    },

    addCookiesToSession: async function addCookiesToSession(url, sessionId, cookies) {
        if (url === "") {
            return new Error("url can not be empty");
        }
        if (sessionId === "") {
            return new Error("sessionId can not be empty");
        }
        let response = await this.tlsClientLibrary.addCookiesToSession(JSON.stringify({url, sessionId, cookies}))
        return JSON.parse(response)
    },

    deleteCookiesToSession:async function deleteCookiesToSession(url, sessionId, cookieName) {
        if (url === "") {
            return new Error("url can not be empty");
        }
        if (sessionId === "") {
            return new Error("sessionId can not be empty");
        }
        let response = await this.tlsClientLibrary.addCookiesToSession(JSON.stringify({
            url, sessionId, cookies: [{
                Name:cookieName,
                MaxAge:-1
            }]
        }))
        return JSON.parse(response)
    },

    getCookiesFromSession: async function getCookiesFromSession(url, sessionId) {
        if (url === "") {
            return new Error("url can not be empty");
        }
        if (sessionId === "") {
            return new Error("sessionId can not be empty");
        }
        let response = await this.tlsClientLibrary.getCookiesFromSession(JSON.stringify({url, sessionId}))
        return JSON.parse(response)
    }

}