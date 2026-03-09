/**
 * @author bragesbr 
 **/

import { UUID } from "crypto";

export default class User {
    id: UUID;
    name: string;
    created_at: string;
    is_admin: boolean;
    email: string;
    bio: string;
    image_url: string;

    constructor(id: UUID, name: string, created_at: string, is_admin: boolean, email: string, bio: string, image_url: string) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.is_admin = is_admin;
        this.email = email;
        this.bio = bio;
        this.image_url = image_url;
        //Puts the user in session storage for later use
        sessionStorage.setItem("user", JSON.stringify(this));
    }
}