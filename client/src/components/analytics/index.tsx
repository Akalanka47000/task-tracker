import { EmployeeInsights } from './employee-insights';
import { SystemInsights } from './system-insights';

export function Analytics() {
  return (
    <div className="w-full flex flex-col gap-8">
      <SystemInsights />
      <EmployeeInsights />
    </div>
  );
}
