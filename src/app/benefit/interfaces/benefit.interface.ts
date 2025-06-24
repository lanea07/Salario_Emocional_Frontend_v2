import { BenefitDetail } from '../../benefit-detail/interfaces/benefit-detail.interface';
import { ApiV1Response } from '../../shared/interfaces/ApiV1Response.interface';

export interface Benefits extends ApiV1Response<Benefit[]>{
}

export interface Benefit {
  id: number;
  name: string;
  politicas_path: null;
  logo_file: null;
  encoded_logo: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
  benefit_detail: BenefitDetail[];
}
