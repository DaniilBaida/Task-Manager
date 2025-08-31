import { Task } from "@/core/domain/entities/Task";
import { ITask } from "@/infrastructure/database/repositories/types";
import TaskError from "@/shared/errors/TaskError";

function createTask(overrides: Partial<ITask> = {}): Task {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const defaults: ITask = {
        id: "test-task-id",
        user_id: "test-user-id",
        project_id: "test-project-id",
        name: "Test Task",
        description: "Test Description",
        due_date: tomorrow,
        completed_on: null,
        created_at: now,
        ...overrides,
    };
    return Task.mapTask(defaults);
}

describe("Task", () => {
    describe("business logic", () => {
        it("marks incomplete task as completed", () => {
            const task = createTask();

            task.markAsCompleted();

            expect(task.completed_on).toBeInstanceOf(Date);
        });

        it("throws error when marking completed task as completed", () => {
            const task = createTask({ completed_on: new Date() });

            expect(() => task.markAsCompleted()).toThrow(TaskError);
        });

        it("calculates priority based on due date", () => {
            const today = new Date();
            const threeDays = new Date();
            threeDays.setDate(today.getDate() + 3);

            const highPriority = createTask({ due_date: today });
            const lowPriority = createTask({ due_date: threeDays });
            const noPriority = createTask({ due_date: null });

            expect(highPriority.priorityLevel).toBe("high");
            expect(lowPriority.priorityLevel).toBe("low");
            expect(noPriority.priorityLevel).toBeNull();
        });

        it("converts to DTO with priority level", () => {
            const task = createTask({ name: "DTO Test" });
            const dto = task.asDto();

            expect(dto.name).toBe("DTO Test");
            expect(dto.priority_level).toBeDefined();
        });
    });
});
