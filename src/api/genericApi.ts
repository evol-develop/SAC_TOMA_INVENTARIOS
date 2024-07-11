import { collection, getDocs, query, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, where, QuerySnapshot, DocumentData, WhereFilterOp, onSnapshot } from "firebase/firestore";
import { FirebaseDB } from "src/firebase/firebase-config";


// CREATE
export const createItem = async (collectionName: string, object: any) => {
    const colRef = collection(FirebaseDB, collectionName);
    const data = await addDoc(colRef, object);
    return data;
}

// UPDATE
export const updateItem = async (collectionName: string, id: string, obj: any) => {
    const docRef = doc(FirebaseDB, collectionName, id);
    return await updateDoc(docRef, obj)
}

// READ
export const getItems = async (collectionName: string) => {
    const colRef = collection(FirebaseDB, collectionName);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}

// READ WITH WHERE
// Tener en cuenta que el tipo de dato de la condición debe coincidir con el tipo de dato que hay en Firebase o no obtendré un dato de respuesta
export const getItemsByCondition = async (collectionName: string, campo: string, operador: WhereFilterOp, valor: any) => {
    const colRef = collection(FirebaseDB, collectionName);
    const result = await getDocs(query(colRef, where(campo, operador, valor)))
    return getArrayFromCollection(result);
}

export const getItemById = async (collectionName: string, id: string) => {
    const docRef = doc(FirebaseDB, collectionName, id);
    const result = await getDoc(docRef);
    return { ...result.data(), id }
}

// DELETE
export const deleteItem = async (collectionName: string, id: string) => {
    const docRef = doc(FirebaseDB, collectionName, id);
    await deleteDoc(docRef);
}

const getArrayFromCollection = (collection: QuerySnapshot<DocumentData>) => {
    return collection.docs.map(doc => {
        return { ...doc.data(), id: doc.id, };
    });
}

export const getSnapShotByCondition = async (collectionName: string, id: string) => {

    // const unsub = onSnapshot(doc(FirebaseDB, collectionName, id), (doc) => {
    //     console.log("Current data: ", doc.data());
    // });

    // const colRef = collection(FirebaseDB,collectionName)
    // const result = await getDocs(query(colRef, where('idEmpresa', '==', id)))
    // const result2 = await result.docChanges()

    // console.log(
    //     result2.map(doc => {
    //         return {...doc['_document'].data()}
    //     }

    //     )
    // )
    //   .where("name", "==", "Guizmo")
    //   .onSnapshot((querySnapshot) =>
    //     querySnapshot.forEach((document) => console.log(document.id))
    //   );

    let data = null
    const q = query(collection(FirebaseDB, collectionName), where("idEmpresa", "==", id));

    // const unsuscribe = onSnapshot(q, (querySnapshot) => {
    //     data = querySnapshot.docChanges().forEach((change) => {
    //         if (change.type === "added") {
    //             console.log("New city: ", change.doc.data());
    //         }
    //         if (change.type === "modified") {
    //             console.log("Modified city: ", change.doc.data());
    //         }
    //         if (change.type === "removed") {
    //             console.log("Removed city: ", change.doc.data());
    //         }

    //       });
    // });
    let resultado = []
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
            resultado = [...resultado, doc.data()]
        })
        console.log(resultado)
    });



}