export interface Instrumentation {
  instrument: string;
  count: number;
}

export interface Work {
  workId: string;
  composerId: string;
  title: string;
  subtitle?: string;
  year?: string;
  duration?: string;
  movements?: string[];
  instrumentation?: Instrumentation[];
  description?: string;

  createdAt?: string;
  updatedAt?: string;
}
