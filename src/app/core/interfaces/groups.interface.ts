import { Person } from "./manage-person.interface";
import { Networks } from "./network.interface";

export interface Groups {
    id: string;
    name: string;
    network_id: string;
    address: string;
    creation_date: string;
    update_date: string;
    status: boolean;
    networks?: Networks;
    leadersGroup?: LeadersGroup[];
    person?: Person[];
}

export interface LeadersGroup {
    people_id: string;
    group_id: string;
    person: Person;
}

