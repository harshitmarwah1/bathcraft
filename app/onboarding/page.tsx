"use client";

import OnboardingFlow from "@/components/auth/OnboardingFlow";
import AuthGate from "@/components/auth/AuthGate";

export default function OnboardingPage() {
  // Access is enforced in proxy.ts before this ever renders.
  return (
    <AuthGate>
      <main className="min-h-screen bg-white">
        <OnboardingFlow />
      </main>
    </AuthGate>
  );
}
