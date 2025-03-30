import { FILTER } from '@/constants';
import { useGetSystemInsights } from '@/hooks';
import { useAnalyticsStore } from '@/store/analytics';
import { cn } from '@/utils';
import { Skeleton } from '@heroui/react';

export const testIds = {
    systemInsights: 'system-insights'
};

function SystemInsightCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('w-full flex flex-col justify-center items-center rounded-md border gap-2 p-6', className)}
            {...props}>
            {children}
        </div>
    );
}

export function SystemInsights() {
    const selectedDepartment = useAnalyticsStore((state) => state.selectedDepartment);

    const { data, isLoading } = useGetSystemInsights({
        params: {
            [`${FILTER}[department]`]: selectedDepartment
        }
    });

    return (
        <div
            className="w-full flex flex-col lg:flex-row justify-center items-center gap-4"
            data-testid={testIds.systemInsights}
        >
            {isLoading ? (
                <>
                    <Skeleton className="w-full h-[7.75rem] lg:flex-1 rounded-md" />
                    <Skeleton className="w-full h-[21.75rem] sm:h-[7.75rem] lg:flex-[2] rounded-md" />
                </>
            ) : (
                <>
                    <SystemInsightCard className="flex-1 bg-indigo-500/10 border-indigo-500/10 text-indigo-500">
                        <h5>Total Employees</h5>
                        <h3 className="text-indigo">{data?.total_employees}</h3>
                    </SystemInsightCard>
                    <SystemInsightCard className="flex-col sm:flex-row flex-[2] gap-6 bg-amber-500/10 border-amber-500/10 text-amber-500 py-3">
                        <SystemInsightCard className="flex-[2] bg-amber-500/10 border-amber-500/10 text-amber-500 py-3">
                            <h5>Total Tasks</h5>
                            <h3 className="text-indigo">{data?.total_tasks}</h3>
                        </SystemInsightCard>
                        <SystemInsightCard className="flex-[2] bg-success-500/10 border-success-500/10 text-success-500 py-3">
                            <h5>Completed</h5>
                            <h3 className="text-indigo">{data?.completed_tasks}</h3>
                        </SystemInsightCard>
                        <SystemInsightCard className="flex-[2] bg-red-500/10 border-red-500/10 text-red-500 py-3">
                            <h5>Overdue</h5>
                            <h3 className="text-indigo">{data?.overdue_tasks}</h3>
                        </SystemInsightCard>
                    </SystemInsightCard>
                </>
            )}
        </div>
    );
}
