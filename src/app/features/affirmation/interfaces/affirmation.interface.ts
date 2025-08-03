import { MetaResponse } from "../../../core/interfaces/meta.interface";

export interface responseAffirmation {
  pagination: MetaResponse;
  affirmation: Affirmation[];
}

export interface Affirmation {
  id: string;
  name: string;
  type_id: number;
  date: string;
  creation_date: string;
  update_date: string;
  total_list?: number;
  amount?: number;
  total_attended?: number;
}

