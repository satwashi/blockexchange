import { CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Wallet } from "lucide-react";
export default function WalletHeader({ status }: { status: string }) {
  return (
    <CardHeader className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <motion.div
          className="p-3 rounded-full bg-muted"
          animate={
            status === "creating" ? { rotate: 360, scale: [1, 1.1, 1] } : {}
          }
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity },
          }}
        >
          <Wallet className="w-6 h-6 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold">Digital Wallet</h3>
          <p className="text-sm text-muted-foreground">Secure & Fast</p>
        </div>
      </div>

      {status === "success" && (
        <CheckCircle className="w-8 h-8 text-green-500" />
      )}
    </CardHeader>
  );
}
