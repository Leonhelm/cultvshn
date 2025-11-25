import admin from "firebase-admin";

const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({ credential: admin.credential.cert(svc) });

const db = admin.firestore();

export const readOffset = async () => {
  const snap = await db.doc("tg/updates").get();

  return snap.exists ? snap.data().offset : null;
};

export const updateOffset = async (offset) => {
  await db.doc("tg/updates").set({ offset }, { merge: true });
};

export const createUser = async (user) => {
  const { id, firstName, lastName, userName, chatId } = user;
  const userRef = db.collection("users").doc(uid);
  const nameRef = db.collection("usernames").doc(userName);

  await db.runTransaction(async (tx) => {
    const nameSnap = await tx.get(nameRef);

    if (nameSnap.exists) {
      console.log("userName already taken");
      return;
    }

    tx.set(nameRef, { uid: id });
    tx.set(userRef, {
      id,
      firstName,
      lastName,
      userName,
      chatId, // TODO: add field
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // TODO: add field
    });
  });
};
