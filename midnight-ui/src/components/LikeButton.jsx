import { addKudos, getFactionLeaderboard, checkMilestones } from '../utils/Kudos';

function HomePage() {
  const handleLike = async () => {
      await addKudos("giverId123", "receiverId456");
          const milestones = await checkMilestones("receiverId456");
              console.log("Milestones reached:", milestones);
                };

                  return <button onClick={handleLike}>Like</button>;
                  }