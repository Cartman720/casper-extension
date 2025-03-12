export interface Tone {
  group: string;
  label: string;
  description: string;
  value: string;
  icon: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}
