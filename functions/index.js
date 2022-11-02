import functions from "firebase-functions"
import myApi from "./api.js"

const api = functions.https.onRequest(myApi);

export {api}