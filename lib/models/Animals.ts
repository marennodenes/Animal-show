// import { UUID } from "crypto";

export default class Animal {
    id: string;
    name: string;
    breed: string;
    birth_date: string;
    image_url: string | null;
    user_id: string;
    species: string;

    constructor(id: string, name: string, breed: string, birth_date: string, image_url: string | null, user_id: string, species: "dog" | "cat") {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.birth_date = birth_date;
        this.image_url = image_url;
        this.user_id = user_id;
        this.species = species;
    }
}

