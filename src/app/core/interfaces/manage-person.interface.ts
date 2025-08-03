import { Groups } from "./groups.interface";

export interface Person {
  id?: string;
  identity: string;
  names: string;
  surname: string;
  birth_date: string;
  gender: string;
  marital_status: string;
  email: string;
  network_id?: string;
  group_id: string;
  address: string;
  phone: string;
  groups?: Groups
  person_type?: string;
  is_host?:  boolean;
  status? : boolean
}
