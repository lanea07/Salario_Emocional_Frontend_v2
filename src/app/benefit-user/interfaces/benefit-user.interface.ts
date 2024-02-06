import { BenefitDetail } from "src/app/benefit-detail/interfaces/benefit-detail.interface";
import { Benefit } from "src/app/benefit/interfaces/benefit.interface";
import { Dependency } from "src/app/dependency/interfaces/dependency.interface";
import { User } from "src/app/user/interfaces/user.interface";

export interface BenefitUser {
  id: number;
  name: string;
  email: string;
  requirePassChange: boolean;
  dependency_id: number;
  position_id: number;
  leader: number;
  valid_id: boolean;
  birthdate: null;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
  benefit_user: BenefitUserElement[];
  dependency: Dependency;
  descendants_and_self: BenefitUserElement[];
}

export interface BenefitUserElement {
  id: number;
  benefit_user: BenefitUserElement[];
  benefit_id: number;
  benefit_detail_id: number;
  user_id: number;
  benefit_begin_time: Date;
  benefit_end_time: Date;
  created_at: Date;
  updated_at: Date;
  benefits: Benefit;
  benefit_detail: BenefitDetail;
  user: BenefitUser;
  is_approved: number;
  approved_at: Date;
}