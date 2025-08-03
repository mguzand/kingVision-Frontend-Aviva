import { Person } from "../../../core/interfaces/manage-person.interface";
import { MetaResponse } from "../../../core/interfaces/meta.interface";
import { Affirmation } from "./affirmation.interface";


export interface responseNexAffirmation {
    pagination: MetaResponse;
    affirmation: AfirmationList[];
}


export interface AfirmationList {
  people_id: string;
  affirmation_id: string;
  attended?: boolean;
  creation_date?: string;
  update_date?: string;
  person: Person;
  affirmation?: Affirmation;
}