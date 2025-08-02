export interface Project {
  id: number;
  title: string;
  client: string;
  status: "active" | "completed" | "pending";
  progress: number;
  deadline: string;
  budget: number;
}
