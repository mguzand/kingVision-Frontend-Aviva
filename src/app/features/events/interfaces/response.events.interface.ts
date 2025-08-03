export interface responseEventsInterface {
  pagination: Pagination;
  events: Event[];
}

interface Event {
  id: string;
  name: string;
  type_id: number;
  date: string;
  creation_date: string;
  update_date: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
}