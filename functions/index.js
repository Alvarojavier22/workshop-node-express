import functions from "firebase-functions"
import myApi from "./api.js"
// +import { keysApi } from "./crypto.js";

const api = functions.https.onRequest(myApi);
// const apiKeys = functions.https.onRequest(keysApi);

export {api}