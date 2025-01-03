import { motion } from "motion/react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full bg-gray-300 dark:bg-muted-foreground rounded-full h-2.5 mb-4 overflow-hidden">
      <motion.div
        style={{ backgroundColor: "#4f46e5" }}
        className="h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${((currentStep * 100) / (totalSteps * 100)) * 100}%`,
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
