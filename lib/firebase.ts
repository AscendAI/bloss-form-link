import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export async function getFirebaseVideos(folderPath: string) {
  try {
    const listRef = ref(storage, folderPath);
    const res = await listAll(listRef);
    
    // Fetch URLs in parallel
    const videos = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name, // e.g. 'reel4.mp4'
          src: url
        };
      })
    );
    return videos;
  } catch (error) {
    console.error(`Firebase Storage Error (Folder: ${folderPath}):`, error);
    return [];
  }
}
