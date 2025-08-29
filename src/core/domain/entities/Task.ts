import TaskError from "@/shared/errors/TaskError";
import { ITask } from "@/infrastructure/database/repositories/types";
import { TaskDTO } from "../types/dto";

export class Task implements ITask {
    constructor(
        public id: string,
        public user_id: string,
        public project_id: string | null,
        public name: string,
        public description: string | null,
        public due_date: Date | null,
        public completed_on: Date | null,
        public created_at: Date
    ) {}

    static mapTask(data: ITask): Task {
        return new Task(
            data.id,
            data.user_id,
            data.project_id,
            data.name,
            data.description,
            data.due_date,
            data.completed_on,
            data.created_at
        );
    }

    asDto(): TaskDTO {
        return {
            id: this.id,
            user_id: this.user_id,
            project_id: this.project_id,
            name: this.name,
            description: this.description,
            due_date: this.due_date,
            completed_on: this.completed_on,
            priority_level: this.priorityLevel,
        };
    }

    markAsCompleted(): void {
        if (this.completed_on) {
            throw TaskError.alreadyCompleted(this.name, this.completed_on);
        }
        this.completed_on = new Date();
    }

    private setPriorityLevel(): "high" | "low" | null {
        if (!this.due_date) return null;

        const now = new Date();
        const oneDayFromNow = new Date();
        oneDayFromNow.setDate(now.getDate() + 1);

        return this.due_date <= oneDayFromNow ? "high" : "low";
    }

    get priorityLevel() {
        return this.setPriorityLevel();
    }
}
