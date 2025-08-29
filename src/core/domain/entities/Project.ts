import { IProject } from "@/infrastructure/database/repositories/types";
import { ProjectDTO } from "../types/dto";

export class Project implements IProject {
    constructor(
        public id: string,
        public user_id: string,
        public name: string,
        public description: string | null,
        public created_at: Date
    ) {}

    static mapProject(data: IProject): Project {
        return new Project(
            data.id,
            data.user_id,
            data.name,
            data.description,
            data.created_at
        );
    }

    asDto(): ProjectDTO {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            description: this.description,
        };
    }
}
