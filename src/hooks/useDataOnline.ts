import { WhereFilterOp, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { FirebaseDB } from 'src/firebase/firebase-config';
import useRefMounted from './useRefMounted';


interface Props {
    collectionName: string,
    campo?: string,
    operador?: WhereFilterOp,
    valor?: any
}


export const useDataOnline = ({ collectionName, campo, operador, valor }: Props) => {

    const isMountedRef = useRefMounted();
    const [data, setData] = useState([])

    const getData = async () => {
        try {
            const response = query(collection(FirebaseDB, collectionName), where(campo, operador, valor));
            onSnapshot(response, (querySnapshot) => {
                setData(querySnapshot.docs.map(item => {
                    return { ...item.data(), id: item.id } })
                    )
        })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getData()
    }, [isMountedRef])

    return {
        data
    }
}