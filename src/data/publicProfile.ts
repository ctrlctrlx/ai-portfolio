import { publicIdentity } from "@/src/data/profile/public";

// Legacy compatibility adapter. New code should use publicIdentity directly.
export const publicProfile = {
  name: publicIdentity?.name ?? { zh: "", en: "" },
};
