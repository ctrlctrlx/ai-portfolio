import type { EvidenceStatus } from "@/src/data/profile/types";

export function isPublicVerified<T extends EvidenceStatus>(
  value: T
): boolean {
  return (
    value.visibility === "public" &&
    value.verificationStatus === "verified"
  );
}
