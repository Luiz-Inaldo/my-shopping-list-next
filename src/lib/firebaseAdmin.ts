import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

/**
 * Inicializa o Firebase Admin SDK de forma lazy (apenas quando necessário).
 * Isso evita erros durante o build quando as credenciais não estão disponíveis.
 */
function initializeFirebaseAdmin() {
  if (getApps().length) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
    );
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

/**
 * Obtém a instância do Firestore, inicializando o Admin SDK se necessário.
 */
const adminDb = new Proxy({} as Firestore, {
  get(target, prop) {
    if (!_adminDb) {
      initializeFirebaseAdmin();
      _adminDb = getFirestore();
    }
    const value = (_adminDb as any)[prop];
    return typeof value === 'function' ? value.bind(_adminDb) : value;
  }
});

/**
 * Obtém a instância do Auth, inicializando o Admin SDK se necessário.
 */
const adminAuth = new Proxy({} as Auth, {
  get(target, prop) {
    if (!_adminAuth) {
      initializeFirebaseAdmin();
      _adminAuth = getAuth();
    }
    const value = (_adminAuth as any)[prop];
    return typeof value === 'function' ? value.bind(_adminAuth) : value;
  }
});

export { admin, adminDb, adminAuth };
