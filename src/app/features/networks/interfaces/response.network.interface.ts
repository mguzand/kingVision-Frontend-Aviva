import { Networks } from "../../../core/interfaces/network.interface";
import { MetaResponse } from "../../../core/interfaces/meta.interface";

export interface responseNetwork {
    pagination: MetaResponse;
    networks: Networks[];
}

