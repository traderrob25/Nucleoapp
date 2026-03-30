import type { TierID, FeatureKey } from './types'
import { TIER_CONFIG } from './config'

export function hasFeature(tier: TierID, feature: FeatureKey): boolean {
  return TIER_CONFIG[tier]?.features?.[feature] ?? false
}

export function getLockedNav(tier: TierID): string[] {
  return TIER_CONFIG[tier]?.lockedNav ?? []
}
