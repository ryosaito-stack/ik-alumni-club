export {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    type QueryConstraint,
    type DocumentData,
} from 'firebase/firestore';

export { db } from '@/lib/firebase';

export type {
    Information,
    InformationFormData,
    InformationQueryOptions,
} from '@/types/information';

export const COLLECTION_NAME = 'informations';