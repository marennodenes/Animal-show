/**
 * @author mahberg 
 **/

import { UUID } from "crypto";

class Competition {
    id: UUID
    name: string
    start_date: string
    end_date: string
    created_at: Date

    constructor(id: UUID, name: string, start_date: string, end_date: string, created_at: Date) {
        this.id = id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.created_at = created_at;
    }
}