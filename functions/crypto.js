import dbCollecion from "./db.js";
import nodeCrypto from "node:crypto"
// import express from "express";
// import cors from "cors"

const dbkeys = dbCollecion("keys")

/*
const keysApi=express()

keysApi.use(express.json())
keysApi.use(cors())


keysApi.post("/loadkeys",async (req,res)=>{
    console.log("Loading keys")
    console.log("Searching for old keys")
    const algorithm="AES-CBC"
    const dbKeyData=await dbkeys.get("passowrds")
    try {
        if(!dbKeyData){            
            console.log("No previous keys found. Generating...")
            let key = await crypto.subtle.generateKey(
                {
                    name: algorithm,
                    length:256
                }, 
                true,
                ['encrypt', 'decrypt']
            );
            let exported=await crypto.subtle.exportKey("jwk", key);
            let resData=await dbkeys.write("passowrds",exported)
            res.status(200).send({"msg":"Key generated", ...resData})
        }
        else{
            //  keyData, algorithm, extractable, keyUsages
            console.log({dbKeyData})
            await crypto.subtle.importKey("jwk",dbKeyData, algorithm, dbKeyData.ext, dbKeyData.key_ops)
            res.status(200).send("Key loaded")
        }
    } catch (error) {
        console.error({error})
        res.status(500).send("Internal error")
    }    
})
*/
const cryptoEncoder = async () => {
    console.log("Initializing crypto")
    console.log("Loading keys")
    console.log("Searching for old keys")
    const algorithm = "AES-CBC"
    const dbKeyData = await dbkeys.get("passowrds")
    const crypto = nodeCrypto.webcrypto
    var key,iv
    try {
        if (!dbKeyData) {
            console.log("No previous keys found. Generating...")
            key = await crypto.subtle.generateKey(
                {
                    name: algorithm,
                    length: 256
                },
                true,
                ['encrypt', 'decrypt']
            );
            let exported = await crypto.subtle.exportKey("jwk", key);
            iv = crypto.getRandomValues(new Uint8Array(16));
            console.log({iv})
            await dbkeys.write("passowrds", {exported,iv})
            console.log("Key Generated")
            //res.status(200).send({"msg":"Key generated", ...resData})
        }
        else {
            //  keyData, algorithm, extractable, keyUsages
            //console.log({dbKeyData})
            iv=dbKeyData.iv
            key=await crypto.subtle.importKey("jwk", dbKeyData.exported, algorithm, dbKeyData.exported.ext, dbKeyData.exported.key_ops)
            console.log("Key loaded")
            //res.status(200).send("Key loaded")
        }
    } catch (error) {
        console.error({ error })
        throw "Internal error"
    }

    //await generateRsaKey()
    return {
        aesEncrypt: async (plaintext) => {
            const ec = new TextEncoder();
            

            const ciphertext = await crypto.subtle.encrypt({
                name: 'AES-CBC',
                iv,
            }, key, ec.encode(plaintext));
            console.log({ciphertext})
            return {
                key,
                iv,
                ciphertext
            };
        },

        aesDecrypt: async (ciphertext, key, iv) => {
            const dec = new TextDecoder();
            const plaintext = await crypto.subtle.decrypt({
                name: 'AES-CBC',
                iv,
            }, key, ciphertext);

            return dec.decode(plaintext);
        }
    }

}
export { cryptoEncoder }