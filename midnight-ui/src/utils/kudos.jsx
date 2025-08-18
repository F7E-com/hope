import { doc, getDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Adds kudos to a specific user, credited to a specific faction.
 * @param {string} userId - The ID of the user receiving kudos.
 * @param {string} factionName - The faction under which kudos are credited.
 * @param {number} amount - The number of kudos to add.
 */
export async function addKudos(userId, factionName, amount = 1) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  await updateDoc(userRef, {
    [`kudos.${factionName}`]: increment(amount)
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

export async function checkMilestones(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;

  const kudos = snap.data().kudos || {};
  const milestones = [];

  for (const [faction, score] of Object.entries(kudos)) {
    if (score >= 500) milestones.push({ faction, tier: "Gold" });
    else if (score >= 200) milestones.push({ faction, tier: "Silver" });
    else if (score >= 50) milestones.push({ faction, tier: "Bronze" });
  }

  return milestones;
}
