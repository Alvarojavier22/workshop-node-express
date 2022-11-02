import firebase from "firebase-admin"
const app=firebase.initializeApp()
const firebaseDb=app.firestore()

export default function dbCollecion(collection){
    var db=firebaseDb.collection(collection)
    return {
            get: async (id)=>{
                try {
                    let response=await db.doc(id).get()
                    if(!response.exists) return null
                    return{
                        ...response.data(),
                        id
                    }                    
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            getAll: async ()=>{
                try {
                    let response =await db.get()
                    if(!response.exists) return null
                    return response.docs.map(doc=>{
                        return{
                            ...doc.data(),
                            id:doc.id
                        }
                    })                    
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            create:async(data)=>{
                try {
                    let response= await db.add(data)
                    if(!response.exists) return null
                    return (await response.get()).data()                    
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            update:async (id,data)=>{
                try {
                    let response = await db.doc(id)
                    if(!response.exists) return null
                    let updated=await response.set(data,{merge:true})
                    return {
                        updated:updated.writeTime,
                        data:{
                        ...data,
                        id,                    
                    }}                    
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            write:async (id,data)=>{
                try {
                    let response = await db.doc(id)
                    let updated=await response.set(data)
                    return {
                        updated:updated.writeTime,
                        data:{
                        ...data,
                        id,                    
                    }}                    
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            delete:async (id)=>{
                let response= await db.doc(id)
                if(!response.exists) return null
                let deleted=await response.delete()
                return{
                    deleted_at: deleted.writeTime,
                    deleted_id:id
                }
            },
            firebaseDb
    }    
}