import { Person } from "../../../core/interfaces/manage-person.interface";
import { MetaResponse } from "../../../core/interfaces/meta.interface";

export interface ProffesionResponse {
  pagination: MetaResponse;
  proffesion: Proffesion[];
}

interface Proffesion {
  id: string;
  conversion_type: number;
  network_type: string;
  people_id: string;
  date_conversion: string;
  invited_by: null;
  creation_date: string;
  update_date: string;
  person: Person;
} 