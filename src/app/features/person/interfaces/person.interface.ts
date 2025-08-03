import { Person } from "../../../core/interfaces/manage-person.interface";

export interface ResponsePeron {
    person: Person[];
    pagination: Pagination;
}

interface Pagination {
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}