import { CreateTaskUseCase } from "@/core/use-cases/task/CreateTaskUseCase";
import { taskService } from "@/core/services/task";
import { Task } from "@/core/domain/entities/Task";
import { IMailer } from "@/core/services/notification/types";
import config from "@/shared/config/config";
import logger from "@/shared/logger";

// Mock external dependencies
jest.mock("@/core/services/task");
jest.mock("@/shared/logger");

const mockTaskService = taskService as jest.Mocked<typeof taskService>;
const mockLogger = logger as jest.Mocked<typeof logger>;

describe("CreateTaskUseCase Collaboration", () => {
    let useCase: CreateTaskUseCase;
    let mockMailer: jest.Mocked<IMailer>;

    beforeEach(() => {
        mockMailer = {
            send: jest.fn().mockResolvedValue(undefined),
        };
        useCase = new CreateTaskUseCase(mockMailer);
        jest.clearAllMocks();
    });

    describe("UseCase + TaskService + Mailer collaboration", () => {
        it("coordinates task creation with email notification", async () => {
            const taskPayload = {
                name: "New Task",
                description: "Task description",
                project_id: "project-1",
                due_date: new Date(),
            };
            const createdTask = new Task(
                "task-1",
                "user-1",
                "project-1",
                "New Task",
                "Task description",
                new Date(),
                null,
                new Date()
            );

            mockTaskService.createTask.mockResolvedValue(createdTask);

            const result = await useCase.execute(taskPayload, "user-1");

            // Verify TaskService collaboration
            expect(mockTaskService.createTask).toHaveBeenCalledWith(
                taskPayload,
                "user-1"
            );

            // Verify Mailer collaboration
            expect(mockMailer.send).toHaveBeenCalledWith({
                to: config.MAIL.ADMIN_EMAIL,
                subject: "New Task",
                text: "Task 'New Task' was created and is ready for your review",
            });

            expect(result).toBe(createdTask);
        });

        it("handles mailer failure gracefully without affecting task creation", async () => {
            const taskPayload = {
                name: "Task",
                description: null,
                project_id: null,
                due_date: null,
            };
            const createdTask = new Task(
                "task-1",
                "user-1",
                null,
                "Task",
                null,
                null,
                null,
                new Date()
            );

            mockTaskService.createTask.mockResolvedValue(createdTask);
            mockMailer.send.mockRejectedValue(new Error("Email service down"));

            const result = await useCase.execute(taskPayload, "user-1");

            expect(mockTaskService.createTask).toHaveBeenCalled();
            expect(mockMailer.send).toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith(
                new Error("Email service down")
            );
            expect(result).toBe(createdTask);
        });

        it("propagates task service errors without sending email", async () => {
            const taskPayload = {
                name: "Task",
                description: null,
                project_id: null,
                due_date: null,
            };

            mockTaskService.createTask.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                useCase.execute(taskPayload, "user-1")
            ).rejects.toThrow("Database error");

            expect(mockTaskService.createTask).toHaveBeenCalled();
            expect(mockMailer.send).not.toHaveBeenCalled();
            expect(mockLogger.error).not.toHaveBeenCalled();
        });
    });

    describe("cross-boundary data flow", () => {
        it("passes task data through all layers correctly", async () => {
            const taskPayload = {
                name: "Complex Task",
                description: "Detailed description",
                project_id: "proj-123",
                due_date: new Date("2024-01-01"),
            };
            const createdTask = new Task(
                "generated-id",
                "user-123",
                "proj-123",
                "Complex Task",
                "Detailed description",
                new Date("2024-01-01"),
                null,
                new Date()
            );

            mockTaskService.createTask.mockResolvedValue(createdTask);

            await useCase.execute(taskPayload, "user-123");

            // Verify data flows correctly through layers
            expect(mockTaskService.createTask).toHaveBeenCalledWith(
                taskPayload,
                "user-123"
            );
            expect(mockMailer.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: expect.stringContaining("Complex Task"),
                })
            );
        });
    });
});
