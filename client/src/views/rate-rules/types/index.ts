export type StayMode = 'HOURLY' | 'OVERNIGHT' | 'PACKAGE';
export type RateRuleCategory = 'NORMAL' | 'PREMIUM';

export interface RateRule {
  id: string;
  name: string;
  description?: string;
  stayMode: StayMode;
  category: RateRuleCategory;
  price: number;
  durationMin?: number;
  durationHours?: number;
  extraHourPrice?: number;
  validFrom?: string;
  validTo?: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRateRulePayload {
  name: string;
  description?: string;
  stayMode: StayMode;
  category: RateRuleCategory;
  price: number;
  durationMin?: number;
  validFrom?: string;
  validTo?: string;
  priority?: number;
}
