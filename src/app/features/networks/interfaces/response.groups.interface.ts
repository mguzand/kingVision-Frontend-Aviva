import { Groups } from "../../../core/interfaces/groups.interface";
import { MetaResponse } from "../../../core/interfaces/meta.interface";

export interface responseGroup {
  pagination: MetaResponse;
  groups: Groups[];
}