"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X, Shield, Check, AlertTriangle, Circle } from "lucide-react";
import Link from "next/link";

// Custom shake animation
const shakeStyle = {
  animation: "shake 0.5s ease-in-out infinite",
};

// Add the shake keyframes to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }
  `;
  if (!document.head.querySelector("style[data-shake-animation]")) {
    style.setAttribute("data-shake-animation", "true");
    document.head.appendChild(style);
  }
}

interface ProgressStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  href?: string;
}

const LoggedInCta = ({ userVerified }: { userVerified: boolean }) => {
  const [isVisible, setIsVisible] = useState(true);

  const steps: ProgressStep[] = [
    { id: "login", label: "Log in", status: "completed" },
    {
      id: "kyc",
      label: "KYC Verification",
      status: userVerified ? "completed" : "current",
      href: "/kyc",
    },
    {
      id: "wallet",
      label: "Wallet setup",
      status: userVerified ? "current" : "pending",
      href: "/wallet",
    },
  ];

  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />;
      case "current":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepBadgeClasses = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600 shadow-sm";
      case "current":
        return "bg-yellow-100 text-yellow-600 shadow-sm animate-pulse";
      case "pending":
        return "bg-gray-100 text-gray-400";
    }
  };

  if (!isVisible || steps.every((s) => s.status === "completed")) return null;

  const currentStep = steps.find((s) => s.status === "current");

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] 
      px-4 animate-slideDown"
    >
      <Card className="bg-card/95 backdrop-blur-md border border-border/50 shadow-notification">
        <div className="flex items-center justify-between p-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                Complete your account
              </h3>
              <p className="text-sm text-muted-foreground">
                Finish setting up to unlock all features
              </p>
            </div>
          </div>

          {/* Desktop progress steps */}
          <div className="hidden sm:flex items-center gap-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.href && step.status !== "completed" ? (
                  <Link
                    href={step.href}
                    className="group flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 group-hover:shadow-md ${getStepBadgeClasses(
                        step.status
                      )}`}
                      style={step.status === "current" ? shakeStyle : undefined}
                    >
                      {getStepIcon(step.status)}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors duration-200 group-hover:text-primary ${
                        step.status === "current"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${getStepBadgeClasses(
                        step.status
                      )}`}
                      style={step.status === "current" ? shakeStyle : undefined}
                    >
                      {getStepIcon(step.status)}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        step.status === "current"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden flex flex-col gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${getStepBadgeClasses(
                    currentStep?.status || "pending"
                  )}`}
                  style={
                    currentStep?.status === "current" ? shakeStyle : undefined
                  }
                >
                  {getStepIcon(currentStep?.status || "pending")}
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  {currentStep?.label}
                </span>
              </div>

              {currentStep?.href && (
                <Link
                  href={currentStep.href}
                  className="px-3 py-1.5 bg-gradient-primary text-primary-foreground text-xs font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Continue
                </Link>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${
                      ((steps.findIndex((s) => s.status === "current") + 1) /
                        steps.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {steps.findIndex((s) => s.status === "current") + 1}/
                {steps.length}
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-1.5">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    step.status === "current" ? "animate-pulse scale-125" : ""
                  } ${getStepBadgeClasses(step.status)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 rounded-md hover:bg-muted transition-colors duration-200 flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoggedInCta;
