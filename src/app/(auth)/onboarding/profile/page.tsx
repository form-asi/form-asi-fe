import { OnboardingProfileScreen } from "@/features/onboarding/profile-screen";
import { AuthGate } from "@/providers/auth-gate";

export default function ProfilePage() {
  return (
    <AuthGate>
      <OnboardingProfileScreen />
    </AuthGate>
  );
}
