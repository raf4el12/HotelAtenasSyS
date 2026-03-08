import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rateRuleSchema, type RateRuleFormData } from '../functions/rate-rule.schema';
import type { RateRule } from '../types';

export function useRateRuleForm(rateRule?: RateRule) {
  return useForm<RateRuleFormData>({
    resolver: zodResolver(rateRuleSchema),
    defaultValues: {
      name: rateRule?.name ?? '',
      description: rateRule?.description ?? '',
      stayMode: rateRule?.stayMode ?? 'HOURLY',
      category: rateRule?.category ?? 'NORMAL',
      price: rateRule?.price ?? 0,
      durationMin: rateRule?.durationMin ?? undefined,
      priority: rateRule?.priority ?? 0,
      validFrom: rateRule?.validFrom ?? '',
      validTo: rateRule?.validTo ?? '',
    },
  });
}
