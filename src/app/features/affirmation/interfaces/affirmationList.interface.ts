import { Person } from "../../../core/interfaces/manage-person.interface";

export interface responseAffirmationList {
  people_id: string;
  affirmation_id: string;
  attended: boolean;
  creation_date: string;
  update_date: string;
  person: Person;
  payment_method_id?: string,
  participation_type_id?: string,
  typeOfHealth?: TypeOfHealth
}


interface TypeOfHealth {
  id: string,
  name: string
}
 