import { TaskService } from "@/core/services/task/TaskService";
import { repository } from "@/infrastructure/database/repositories";
import { Task } from "@/core/domain/entities/Task";
import {
    ITask,
    ITaskCreatePayload,
} from "@/infrastructure/database/repositories/types";
import TaskError from "@/shared/errors/TaskError";

jest.mock("@/infrastructure/database/repositories");

const mockRepository = repository as jest.Mocked<typeof repository>;

function createTaskData(overrides: Partial<ITask> = {}): ITask {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    return {
        id: "task-1",
        user_id: "user-1",
        project_id: "project-1",
        name: "Test Task",
        description: "Test Description",
        due_date: tomorrow,
        completed_on: null,
        created_at: now,
        ...overrides,
    };
}

describe("TaskService", () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
        jest.clearAllMocks();
    });

    describe("createTask", () => {
        it("creates task successfully", async () => {
            const payload: ITaskCreatePayload = {
                name: "New Task",
                description: "New Description",
                project_id: "project-1",
                due_date: new Date(),
                completed_on: null,
            };
            const taskData = createTaskData({
                name: "New Task",
                description: "New Description",
            });
            mockRepository.createTask.mockResolvedValue(taskData);

            const result = await taskService.createTask(payload, "user-1");

            expect(mockRepository.createTask).toHaveBeenCalledWith(
                payload,
                "user-1"
            );
            expect(result).toBeInstanceOf(Task);
            expect(result.name).toBe("New Task");
        });

        it("propagates repository errors", async () => {
            const payload: ITaskCreatePayload = {
                name: "Task",
                description: null,
                project_id: null,
                due_date: null,
                completed_on: null,
            };
            mockRepository.createTask.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                taskService.createTask(payload, "user-1")
            ).rejects.toThrow("Database error");
        });
    });

    describe("getAllTasks", () => {
        it("gets all tasks with pagination", async () => {
            const taskData1 = createTaskData({ id: "task-1", name: "Task 1" });
            const taskData2 = createTaskData({ id: "task-2", name: "Task 2" });

            mockRepository.getAllTasks.mockResolvedValue({
                tasks: [taskData1, taskData2],
                nextCursor: new Date(),
                prevCursor: null,
            });

            const result = await taskService.getAllTasks(
                10, // limit
                undefined, // nextCursor
                undefined, // prevCursor
                { search: "test" }, // queryParameters
                "user-1"
            );

            expect(mockRepository.getAllTasks).toHaveBeenCalledWith(
                {
                    limit: 10,
                    nextCursor: undefined,
                    prevCursor: undefined,
                    search: "test",
                },
                "user-1"
            );
            expect(result.tasks).toHaveLength(2);
            expect(result.tasks[0]).toBeInstanceOf(Task);
            expect(result.tasks[0].name).toBe("Task 1");
            expect(typeof result.nextCursor).toBe("string");
        });

        it("handles search and filtering", async () => {
            mockRepository.getAllTasks.mockResolvedValue({
                tasks: [],
                nextCursor: null,
                prevCursor: null,
            });

            await taskService.getAllTasks(
                20,
                "cursor123",
                undefined,
                { search: "important", completed: true },
                "user-1"
            );

            expect(mockRepository.getAllTasks).toHaveBeenCalledWith(
                {
                    limit: 20,
                    nextCursor: "cursor123",
                    prevCursor: undefined,
                    search: "important",
                    completed: true,
                },
                "user-1"
            );
        });
    });

    describe("getTask", () => {
        it("gets single task by id", async () => {
            const taskData = createTaskData();
            mockRepository.getTask.mockResolvedValue(taskData);

            const result = await taskService.getTask("task-1", "user-1");

            expect(mockRepository.getTask).toHaveBeenCalledWith(
                "task-1",
                "user-1"
            );
            expect(result).toBeInstanceOf(Task);
            expect(result.id).toBe("task-1");
        });

        it("propagates not found errors", async () => {
            mockRepository.getTask.mockRejectedValue(
                new Error("Task not found")
            );

            await expect(
                taskService.getTask("nonexistent", "user-1")
            ).rejects.toThrow("Task not found");
        });
    });

    describe("updateTask", () => {
        it("updates task successfully", async () => {
            const updatePayload = { name: "Updated Task" };
            const updatedTaskData = createTaskData({ name: "Updated Task" });
            mockRepository.updateTask.mockResolvedValue(updatedTaskData);

            const result = await taskService.updateTask(
                "task-1",
                updatePayload,
                "user-1"
            );

            expect(mockRepository.updateTask).toHaveBeenCalledWith(
                "task-1",
                updatePayload,
                "user-1"
            );
            expect(result).toBeInstanceOf(Task);
            expect(result.name).toBe("Updated Task");
        });
    });

    describe("markTaskAsCompleted", () => {
        it("marks incomplete task as completed", async () => {
            const incompleteTask = createTaskData();

            mockRepository.getTask.mockResolvedValue(incompleteTask);
            mockRepository.updateTask.mockResolvedValue({
                ...incompleteTask,
                completed_on: new Date(),
            });

            const result = await taskService.markTaskAsCompleted(
                "task-1",
                "user-1"
            );

            expect(mockRepository.getTask).toHaveBeenCalledWith(
                "task-1",
                "user-1"
            );
            expect(mockRepository.updateTask).toHaveBeenCalledWith(
                "task-1",
                expect.objectContaining({ completed_on: expect.any(Date) }),
                "user-1"
            );
            expect(result.completed_on).toBeTruthy();
        });

        it("throws error when task is already completed", async () => {
            const completedDate = new Date();
            const completedTask = createTaskData({
                completed_on: completedDate,
            });
            mockRepository.getTask.mockResolvedValue(completedTask);

            await expect(
                taskService.markTaskAsCompleted("task-1", "user-1")
            ).rejects.toThrow(TaskError);
            expect(mockRepository.updateTask).not.toHaveBeenCalled();
        });
    });
});
