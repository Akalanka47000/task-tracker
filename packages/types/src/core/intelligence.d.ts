declare global {
  interface ISystemInsights {
    total_employees: number;
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
  }

  interface IEmployeeInsight extends Pick<IUser, 'id' | 'first_name' | 'last_name' | 'username' | 'details'> {
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    completion_percentage: number;
  }
}
export {};
