import axios from "axios";

export class TasksService {
  private pythonUrl: string;

  constructor() {
    this.pythonUrl = process.env.PYTHON_LLM_URL || "http://localhost:5000";
  }

  async getSummary(text: string, lang: string): Promise<string> {
    const response = await axios.post(`${this.pythonUrl}/summarize`, { text, lang });
    return response.data.summary;
  }
}
