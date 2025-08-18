import { addKudos, checkMilestones } from '../utils/Kudos';
import { useUser } from "../contexts/UserContext";

function LikeButton({ contentCreatorId, contentCreatorFaction }) {
  const { currentUser } = useUser();

  const handleLike = async () => {
    if (!currentUser) return;

    const giverId = currentUser.id;

    try {
      // 1. Give +10 kudos to receiver (content creator) in THEIR faction
      await addKudos(contentCreatorId, contentCreatorFaction, 10);

      // 2. Give +1 kudos to giver, credited to RECEIVER’s faction
      await addKudos(giverId, contentCreatorFaction, 1);

      // 3. Check milestones for receiver
      const milestones = await checkMilestones(contentCreatorId);
      console.log("Milestones reached:", milestones);
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  return (
    <button onClick={handleLike}>
      Like
    </button>
  );
}

export default LikeButton;
