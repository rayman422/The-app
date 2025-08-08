import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, appId } from '../firebase';

export async function addCatch(userId, catchData) {
  if (!db) throw new Error('Firestore is not configured');

  const base = {
    createdAt: serverTimestamp(),
    species: catchData.species,
    weight: catchData.weight ?? null,
    length: catchData.length ?? null,
    notes: catchData.notes ?? '',
  };

  const ref = collection(db, 'artifacts', appId, 'users', userId, 'catches');
  await addDoc(ref, base);
  await updateDoc(doc(db, 'artifacts', appId, 'users', userId, 'userProfile', 'profile'), {
    catches: increment(1),
  });
  return true;
}

export async function listCatches(userId, limit = 10) {
  if (!db) throw new Error('Firestore is not configured');
  const ref = collection(db, 'artifacts', appId, 'users', userId, 'catches');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return items.slice(0, limit);
}

export async function recomputeUserStats(userId) {
  if (!db) throw new Error('Firestore is not configured');
  const ref = collection(db, 'artifacts', appId, 'users', userId, 'catches');
  const snapshot = await getDocs(ref);
  const items = snapshot.docs.map((d) => d.data());
  const catches = items.length;
  const species = new Set(items.map((i) => (i.species || '').toLowerCase())).size;
  await updateDoc(doc(db, 'artifacts', appId, 'users', userId, 'userProfile', 'profile'), {
    catches,
    species,
  });
}