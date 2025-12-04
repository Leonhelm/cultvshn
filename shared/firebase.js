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

export const createChat = async (chat) => {
  const { chatId, userId, userName = "", firstName = "", lastName = "" } = chat;

  const userRef = db.collection("chats").doc(String(chatId));

  await db.runTransaction(async (transaction) => {
    transaction.set(userRef, {
      chatId,
      userId,
      userName,
      firstName,
      lastName,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
};

export const getChats = async () => {
  const snap = await db.collection("chats").get();

  return new Map(
    snap.docs.map((doc) => {
      const data = doc.data();

      return [data.chatId, data];
    })
  );
};
