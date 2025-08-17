import { doc, getDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function addKudos(giverId, receiverId) {
  const giverRef = doc(db, "users", giverId);
  const receiverRef = doc(db, "users", receiverId);

  const giverSnap = await getDoc(giverRef);
  if (!giverSnap.exists()) return;

  const giverFaction = giverSnap.data().faction;

  await updateDoc(receiverRef, {
    [`kudos.${giverFaction}`]: increment(1)
  });
}

export async function getFactionLeaderboard(faction) {
  const snapshot = await getDocs(collection(db, "users"));
  const leaderboard = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    leaderboard.push({ name: data.name, kudos: data.kudos[faction] || 0 });
  });
  return leaderboard.sort((a, b) => b.kudos - a.kudos);
}

// Optional: milestone checker
export async function checkMilestones(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;

  const kudos = snap.data().kudos;
  // Example milestone logic
  const milestones = [];
  for (const [faction, score] of Object.entries(kudos)) {
    if (score >= 50) milestones.push({ faction, tier: "Bronze" });
    if (score >= 200) milestones.push({ faction, tier: "Silver" });
    if (score >= 500) milestones.push({ faction, tier: "Gold" });
  }
  return milestones;
}