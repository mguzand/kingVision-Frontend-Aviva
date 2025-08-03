export interface responseStudent {
  student: Student[];
  classes: Classes[];
}

export interface Classes {
  date_class: string;
  scool_class_id: string;
  period_id: string;
  status: boolean;
  creation_date: string;
  update_date: string;
  scoolClasses: ScoolClasses;
}

interface ScoolClasses {
  id: string;
  name: string;
  optional: boolean;
  vission_id: string;
  creation_date: string;
  update_date: string;
}

interface Student {
  period_id: string;
  people_id: string;
  status: boolean;
  creation_date: string;
  update_date: string;
  person: Person;
  asistencia?: boolean;
  color?: string;
}

interface Person {
  id: string;
  identity: null | string;
  names: string;
  surname: string;
  gender: string;
  marital_status: string;
  birth_date: string;
  email: string;
  phone: string;
  address: string;
  group_id: string;
  person_type: string;
  is_host: boolean;
  creation_date: string;
  update_date: string;
}