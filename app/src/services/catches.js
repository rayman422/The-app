import { collection, addDoc, doc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebase';

const LOCAL_KEY = 'demo_catches';

export async function addCatch(userId, catchData) {
  const base = {
    createdAt: new Date().toISOString(),
    ...catchData,
  };

  if (db) {
    const ref = collection(db, 'artifacts', appId, 'users', userId, 'catches');
    await addDoc(ref, { ...base, createdAt: serverTimestamp() });
    return true;
  }

  const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  list.unshift({ id: crypto.randomUUID(), ...base });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  return true;
}

export async function listCatches(userId, limit = 10) {
  if (db) {
    const ref = collection(db, 'artifacts', appId, 'users', userId, 'catches');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  return list.slice(0, limit);
}