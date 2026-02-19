/**
 * @author mahberg 
 **/

import { UUID } from "crypto";

export default class Competition {
    id: UUID
    name: string
    start_date: string
    end_date: string
    created_at: Date
    desctiption: string

    constructor(id: UUID, name: string, start_date: string, end_date: string, created_at: Date, description: string) {
        this.id = id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.created_at = created_at;
        this.desctiption = description;
    }
}