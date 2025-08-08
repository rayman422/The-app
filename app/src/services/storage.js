import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';

function assertAuth() {
  if (!auth?.currentUser) throw new Error('Not authenticated');
}

export async function uploadUserAvatar(file) {
  assertAuth();
  const uid = auth.currentUser.uid;
  const path = `users/${uid}/images/avatar_${Date.now()}.jpg`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  return getDownloadURL(r);
}

export async function uploadCatchPhoto(file, catchId) {
  assertAuth();
  const uid = auth.currentUser.uid;
  const path = `users/${uid}/images/catches/${catchId}_${Date.now()}.jpg`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  return getDownloadURL(r);
}