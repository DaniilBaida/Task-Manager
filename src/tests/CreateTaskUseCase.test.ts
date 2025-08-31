import { CreateTaskUseCase } from "@/core/use-cases/task/CreateTaskUseCase";
import { taskService } from "@/core/services/task";
import { IMailer } from "@/core/services/notification/types";
import { Task } from "@/core/domain/entities/Task";
import {
    ITask,
    ITaskCreatePayload,
} from "@/infrastructure/database/repositories/types";
import config from "@/shared/config/config";
import logger from "@/shared/logger";

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

function createTaskPayload(
    overrides: Partial<ITaskCreatePayload> = {}
): ITaskCreatePayload {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
        project_id: "test-project-id",
        name: "Test Task",
        description: "Test Description",
        due_date: tomorrow,
        completed_on: null,
        ...overrides,
    };
}

jest.mock("@/core/services/task");
jest.mock("@/shared/logger");

const mockTaskService = taskService as jest.Mocked<typeof taskService>;
const mockLogger = logger as jest.Mocked<typeof logger>;

describe("CreateTaskUseCase", () => {
    let useCase: CreateTaskUseCase;
    let mockMailer: jest.Mocked<IMailer>;

    beforeEach(() => {
        mockMailer = { send: jest.fn().mockResolvedValue(undefined) };
        useCase = new CreateTaskUseCase(mockMailer);
        jest.clearAllMocks();
    });

    it("creates task and sends notification", async () => {
        const payload = createTaskPayload({ name: "New Task" });
        const task = createTask({ name: "New Task" });
        mockTaskService.createTask.mockResolvedValue(task);

        const result = await useCase.execute(payload, "user-1");

        expect(mockTaskService.createTask).toHaveBeenCalledWith(
            payload,
            "user-1"
        );
        expect(mockMailer.send).toHaveBeenCalledWith({
            to: config.MAIL.ADMIN_EMAIL,
            subject: "New Task",
            text: "Task 'New Task' was created and is ready for your review",
        });
        expect(result).toBe(task);
    });

    it("handles email failures gracefully", async () => {
        const payload = createTaskPayload();
        const task = createTask();
        mockTaskService.createTask.mockResolvedValue(task);
        mockMailer.send.mockRejectedValue(new Error("Email failed"));

        const result = await useCase.execute(payload, "user-1");

        expect(mockLogger.error).toHaveBeenCalledWith(
            new Error("Email failed")
        );
        expect(result).toBe(task);
    });

    it("propagates task creation errors", async () => {
        const payload = createTaskPayload();
        mockTaskService.createTask.mockRejectedValue(new Error("DB error"));

        await expect(useCase.execute(payload, "user-1")).rejects.toThrow(
            "DB error"
        );
        expect(mockMailer.send).not.toHaveBeenCalled();
    });
});
