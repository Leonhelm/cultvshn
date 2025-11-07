import admin from 'firebase-admin';

const svc = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({ credential: admin.credential.cert(svc) });

const db = admin.firestore();

export const readOffset = async () => {
  const snap = await db.doc('tg/updates').get();

  return snap.exists ? snap.data().offset : null;
};

export const updateOffset = async (offset) => {
  await db.doc('tg/updates').set({ offset }, { merge: true });
};
