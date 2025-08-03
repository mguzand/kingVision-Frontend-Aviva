export interface responseListStudent {
  period: Period[];
  pagination: Pagination;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface Period {
  period_id: string;
  people_id: string;
  status: boolean;
  creation_date: string;
  update_date: string;
  person: Person;
}

interface Person {
  id: string;
  identity: string;
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