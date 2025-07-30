// lib/prismaEnums.ts (or wherever you prefer)

export const PrivacyLevelEnum = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  FRIENDS_ONLY: 'FRIENDS_ONLY',
} as const;

export type PrivacyLevel = (typeof PrivacyLevelEnum)[keyof typeof PrivacyLevelEnum];
