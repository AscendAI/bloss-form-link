const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if (k && v) acc[k] = v.replace(/"/g, '').replace(/\r/g, '').trim();
  return acc;
}, {});

const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll } = require('firebase/storage');

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
});

Promise.all([
  listAll(ref(storage, "coach-bloss")).catch(() => ({ items: [] })),
  listAll(ref(storage, "coach-bloss/videos")).catch(() => ({ items: [] }))
]).then(([res1, res2]) => {
  console.log("coach-bloss:", res1.items.map(i => i.name));
  console.log("coach-bloss/videos:", res2.items.map(i => i.name));
}).catch(console.error);
