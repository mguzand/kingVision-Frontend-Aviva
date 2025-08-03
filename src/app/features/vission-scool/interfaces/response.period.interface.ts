export interface ResponsePeriod {
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
  id: string;
  name: string;
  vision_scool_id: string;
  creation_date: string;
  update_date: string;
  classItinerary: ClassItinerary[];
  total_list: number;
}

interface ClassItinerary {
  date_class: string;
  scool_class_id: string;
  period_id: string;
  creation_date: string;
  update_date: string;
  scoolClasses: scoolClasses
}


 interface scoolClasses {
  id: string;
  name: string;
  optional: boolean;
  vission_id: string;
  creation_date: string;
  update_date: string;
}