import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migratePosts() {
  const usersSnap = await db.collection("users").get();

  for (const userDoc of usersSnap.docs) {
    const postsSnap = await db
      .collection("users")
      .doc(userDoc.id)
      .collection("posts")
      .get();

    for (const postDoc of postsSnap.docs) {
      const postData = postDoc.data();

      await db.collection("posts").doc(postDoc.id).set({
        ...postData,
        userId: userDoc.id,
      });

      console.log(`Migrated post ${postDoc.id} from user ${userDoc.id}`);
    }
  }

  console.log("✅ Migration complete.");
  process.exit(0);
}

migratePosts().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
