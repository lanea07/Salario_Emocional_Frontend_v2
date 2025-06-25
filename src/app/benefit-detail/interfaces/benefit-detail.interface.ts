import { Benefit } from '../../benefit/interfaces/benefit.interface';

export interface BenefitDetail {
  id?: number;
  name: string;
  time_hours: number;
  created_at: Date;
  updated_at: Date;
  benefit: Benefit[];
  valid_id: boolean;
}