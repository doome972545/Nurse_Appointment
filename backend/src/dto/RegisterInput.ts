export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "nurse" | "head_nurse";
}
