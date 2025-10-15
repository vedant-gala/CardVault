import { Reward } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface RewardProgressCardProps {
  reward: Reward;
  cardColor?: string;
}

export function RewardProgressCard({ reward, cardColor = "#8B5CF6" }: RewardProgressCardProps) {
  const progress = (Number(reward.currentProgress) / Number(reward.threshold)) * 100;
  const isUnlocked = progress >= 100;
  const remaining = Number(reward.threshold) - Number(reward.currentProgress);

  return (
    <Card 
      className={`p-6 space-y-4 ${isUnlocked ? 'border-success' : ''}`}
      data-testid={`reward-${reward.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isUnlocked ? (
              <Trophy className="w-5 h-5 text-success" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
            <h3 className="font-semibold text-lg">{reward.rewardType}</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-success bg-clip-text text-transparent">
            {reward.rewardValue}
          </p>
        </div>
        
        <Badge 
          variant={isUnlocked ? "default" : "secondary"}
          className={isUnlocked ? "bg-success text-success-foreground" : ""}
          data-testid={`reward-status-${reward.id}`}
        >
          {isUnlocked ? "Unlocked" : "Locked"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{reward.condition}</span>
          <span className="font-semibold tabular-nums" data-testid={`reward-progress-${reward.id}`}>
            ₹{Number(reward.currentProgress).toLocaleString()} / ₹{Number(reward.threshold).toLocaleString()}
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={Math.min(progress, 100)} 
            className="h-3"
            style={{
              background: `linear-gradient(to right, ${cardColor}20, ${cardColor}10)`
            }}
          />
          {isUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 bg-gradient-success opacity-80 rounded-full"
            />
          )}
        </div>

        {!isUnlocked && remaining > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>₹{remaining.toLocaleString()} more to unlock</span>
          </div>
        )}
      </div>
    </Card>
  );
}
