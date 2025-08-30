import { Task } from "@/core/domain/entities/Task";
import TaskError from "@/shared/errors/TaskError";

describe("Task", () => {
    let task: Task;

    beforeEach(() => {
        task = new Task(
            "task-1",
            "user-1",
            "project-1",
            "Test Task",
            "Test Description",
            null, // will be set in individual tests
            null, // not completed
            new Date()
        );
    });

    describe("initialization", () => {
        it("creates task with all properties set correctly", () => {
            expect(task.id).toBe("task-1");
            expect(task.user_id).toBe("user-1");
            expect(task.project_id).toBe("project-1");
            expect(task.name).toBe("Test Task");
            expect(task.description).toBe("Test Description");
            expect(task.due_date).toBeNull();
            expect(task.completed_on).toBeNull();
            expect(task.created_at).toBeInstanceOf(Date);
        });
    });

    describe("markAsCompleted", () => {
        it("sets completed_on to current date for incomplete task", () => {
            const beforeMark = new Date();
            task.markAsCompleted();
            const afterMark = new Date();

            expect(task.completed_on).toBeTruthy();
            expect(task.completed_on!.getTime()).toBeGreaterThanOrEqual(
                beforeMark.getTime()
            );
            expect(task.completed_on!.getTime()).toBeLessThanOrEqual(
                afterMark.getTime()
            );
        });

        it("throws error when task is already completed", () => {
            task.markAsCompleted();

            expect(() => task.markAsCompleted()).toThrow(TaskError);
        });
    });

    describe("priorityLevel", () => {
        it("returns null when no due date", () => {
            task.due_date = null;

            expect(task.priorityLevel).toBeNull();
        });

        it('returns "high" when due date is today', () => {
            task.due_date = new Date();

            expect(task.priorityLevel).toBe("high");
        });

        it('returns "high" when due date is tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            task.due_date = tomorrow;

            expect(task.priorityLevel).toBe("high");
        });

        it('returns "low" when due date is more than 1 day away', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 2);
            task.due_date = futureDate;

            expect(task.priorityLevel).toBe("low");
        });

        it('returns "high" when due date is in the past', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            task.due_date = yesterday;

            expect(task.priorityLevel).toBe("high");
        });
    });

    describe("mapTask", () => {
        it("creates Task instance from ITask data with all properties", () => {
            const taskData = {
                id: "mapped-task",
                user_id: "user-2",
                project_id: "project-2",
                name: "Mapped Task",
                description: "Mapped Description",
                due_date: new Date(),
                completed_on: new Date(),
                created_at: new Date(),
            };

            const mappedTask = Task.mapTask(taskData);

            expect(mappedTask).toBeInstanceOf(Task);
            expect(mappedTask.id).toBe(taskData.id);
            expect(mappedTask.user_id).toBe(taskData.user_id);
            expect(mappedTask.project_id).toBe(taskData.project_id);
            expect(mappedTask.name).toBe(taskData.name);
            expect(mappedTask.description).toBe(taskData.description);
            expect(mappedTask.due_date).toBe(taskData.due_date);
            expect(mappedTask.completed_on).toBe(taskData.completed_on);
            expect(mappedTask.created_at).toBe(taskData.created_at);
        });

        it("creates Task instance with null values", () => {
            const taskData = {
                id: "task-null",
                user_id: "user-1",
                project_id: null,
                name: "Task Name",
                description: null,
                due_date: null,
                completed_on: null,
                created_at: new Date(),
            };

            const mappedTask = Task.mapTask(taskData);

            expect(mappedTask.project_id).toBeNull();
            expect(mappedTask.description).toBeNull();
            expect(mappedTask.due_date).toBeNull();
            expect(mappedTask.completed_on).toBeNull();
        });
    });
});
