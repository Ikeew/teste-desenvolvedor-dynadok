import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";
import { TasksService } from "../services/tasksServices";

const router = Router();
const tasksRepository = new TasksRepository();
const tasksService = new TasksService();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }
    if (!lang || (lang !== "pt" && lang !== "en" && lang !== "es")) {
      return res.status(400).json({ error: "Language not supported" });
    }

    const task = tasksRepository.createTask(text, lang);
    const summary = await tasksService.getSummary(text, lang);
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

router.get("/", (_req: Request, res: Response) => {
  return res.json(tasksRepository.getAllTasks());
});

router.get("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.getTaskById(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.json(task);
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = tasksRepository.deleteTask(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.status(204).send();
});

export default router;
