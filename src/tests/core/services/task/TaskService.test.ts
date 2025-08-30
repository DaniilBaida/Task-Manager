import { TaskService } from "@/core/services/task/TaskService";
import { Task } from "@/core/domain/entities/Task";
import { repository } from "@/infrastructure/database/repositories";
import TaskError from "@/shared/errors/TaskError";

// Mock the repository
jest.mock("@/infrastructure/database/repositories");
const mockRepository = repository as jest.Mocked<typeof repository>;

describe("TaskService", () => {
    let taskService: TaskService;
    let mockTaskData: any;

    beforeEach(() => {
        taskService = new TaskService();
        mockTaskData = {
            id: "task-1",
            user_id: "user-1",
            project_id: "project-1",
            name: "Test Task",
            description: "Test Description",
            due_date: null,
            completed_on: null,
            created_at: new Date(),
        };
        jest.clearAllMocks();
    });

    describe("markTaskAsCompleted", () => {
        it("successfully marks incomplete task as completed", async () => {
            mockRepository.getTask.mockResolvedValue(mockTaskData);
            mockRepository.updateTask.mockResolvedValue({
                ...mockTaskData,
                completed_on: expect.any(Date),
            });

            const result = await taskService.markTaskAsCompleted("task-1", "user-1");

            expect(mockRepository.getTask).toHaveBeenCalledWith("task-1", "user-1");
            expect(mockRepository.updateTask).toHaveBeenCalledWith(
                "task-1",
                expect.objectContaining({
                    completed_on: expect.any(Date),
                }),
                "user-1"
            );
            expect(result.completed_on).toBeTruthy();
        });

        it("throws error when task is already completed", async () => {
            const completedTaskData = {
                ...mockTaskData,
                completed_on: new Date(),
            };
            mockRepository.getTask.mockResolvedValue(completedTaskData);

            await expect(
                taskService.markTaskAsCompleted("task-1", "user-1")
            ).rejects.toThrow(TaskError);

            expect(mockRepository.updateTask).not.toHaveBeenCalled();
        });
    });
});