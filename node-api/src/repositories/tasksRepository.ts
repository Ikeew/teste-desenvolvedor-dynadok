import fs from "fs";
import path from "path";

interface Task {
  id: number;
  text: string;
  lang: string;
  summary: string | null;
}

export class TasksRepository {
  private tasks: Task[] = [];
  private currentId: number = 1;
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(process.env.TASKS_FILE || "./tasks.json");
    this.load();
  }

  private load(): void {
    if (!fs.existsSync(this.filePath)) return;
    const raw = fs.readFileSync(this.filePath, "utf-8");
    const data = JSON.parse(raw);
    this.tasks = data.tasks || [];
    this.currentId = data.currentId || 1;
  }

  private save(): void {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify({ currentId: this.currentId, tasks: this.tasks }, null, 2)
    );
  }

  createTask(text: string, lang: string): Task {
    const task: Task = { id: this.currentId++, text, lang, summary: null };
    this.tasks.push(task);
    this.save();
    return task;
  }

  updateTask(id: number, summary: string): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.summary = summary;
    this.save();
    return task;
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.save();
    return true;
  }
}
