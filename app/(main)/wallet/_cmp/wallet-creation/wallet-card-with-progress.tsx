"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, AlertCircle, Zap } from "lucide-react";
import WalletHeader from "./header";
import { useCreateUserWalllets } from "@/queries/wallets/use-create-user-wallets";
import { queryClient } from "@/providers/query-provider";

export type WalletStatus = "idle" | "creating" | "success" | "error";

interface WalletCardWithProgressProps {
  walletId?: string;
  children?: React.ReactNode;
}

// Progress steps for animation
const CREATION_STEPS: Array<{ progress: number; delay: number; text: string }> =
  [
    { progress: 15, delay: 200, text: "Initializing wallet..." },
    { progress: 35, delay: 500, text: "Generating secure keys..." },
    { progress: 60, delay: 400, text: "Setting up wallet..." },
    { progress: 85, delay: 300, text: "Finalizing setup..." },
    { progress: 100, delay: 200, text: "Almost done!" },
  ];

const WalletCardWithProgress: React.FC<WalletCardWithProgressProps> = ({
  children,
}) => {
  const { createWallets } = useCreateUserWalllets();

  const [status, setStatus] = useState<WalletStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const simulateWalletCreation = async () => {
    setStatus("creating");
    setProgress(0);
    setErrorMessage("");
    setProgressText("Starting wallet creation...");

    try {
      // 1️⃣ Create wallet first using the hook
      createWallets();
      // 2️⃣ Animate progress bar after wallet creation
      for (const step of CREATION_STEPS) {
        setProgress(step.progress);
        setProgressText(step.text);
        await new Promise((r) => setTimeout(r, step.delay));
      }

      // 3️⃣ Show success
      setStatus("success");
      queryClient.invalidateQueries({ queryKey: ["user_wallets"] });
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err instanceof Error ? err.message : "Failed to create wallet";
      setErrorMessage(message);
    }
  };

  const resetComponent = () => {
    setStatus("idle");
    setProgress(0);
    setProgressText("");
    setErrorMessage("");
  };

  const renderDefaultFeatures = () => (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">Features</span>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>• Instant transactions</li>
        <li>• Multi-currency support</li>
        <li>• Bank-grade security</li>
      </ul>
    </div>
  );

  return (
    <div className="w-full flex items-center justify-center">
      <Card className="overflow-hidden bg-secondary rounded-2xl p-6 w-full max-w-md">
        <WalletHeader status={status} />
        <CardContent className="space-y-4">
          {children || renderDefaultFeatures()}

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  onClick={simulateWalletCreation}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Wallet
                </Button>
              </motion.div>
            )}

            {status === "creating" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>{progressText}</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center text-green-500 font-bold space-y-1"
              >
                <CheckCircle className="w-6 h-6 mx-auto" />
                Wallet Created Successfully!
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Creation Failed</AlertTitle>
                  <p>{errorMessage}</p>
                </Alert>
                <Button
                  onClick={resetComponent}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletCardWithProgress;
