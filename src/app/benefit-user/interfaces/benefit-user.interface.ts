export interface BenefitUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  position_id: number;
  leader: number;
  created_at: Date;
  updated_at: Date;
  benefit_user: BenefitUserElement[];
}

export interface BenefitUserElement {
  id: number;
  benefit_id: number;
  benefit_detail_id: number;
  user_id: number;
  benefit_begin_time: Date;
  benefit_end_time: Date;
  created_at: Date;
  updated_at: Date;
  benefits: Benefit;
  benefit_detail: Benefit;
}

export interface Benefit {
  id: number;
  name: string;
  time_hours?: number;
  created_at: Date;
  updated_at: Date;
}
