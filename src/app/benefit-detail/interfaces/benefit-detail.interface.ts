import { Benefit } from '../../benefit/interfaces/benefit.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';

export interface BenefitDetails extends ApiV1Response<BenefitDetail[]>{
}

export interface BenefitDetail {
  id?: number;
  name: string;
  time_hours: number;
  created_at: Date;
  updated_at: Date;
  benefit: Benefit[];
  valid_id: boolean;
}

interface Pivot {
  benefit_detail_id: number;
  benefit_id: number;
  created_at: Date;
  updated_at: Date;
}
