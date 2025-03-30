import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChartNoAxesCombined, Loader2, PackageOpen } from 'lucide-react';
import { FILTER, LIMIT_9 } from '@/constants';
import { useGetEmployeeInsights } from '@/hooks';
import { useAnalyticsStore } from '@/store/analytics';
import { cn } from '@/utils';
import { Chip, Progress } from '@heroui/react';

interface EmployeeInsightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  insight: IEmployeeInsight;
}

function EmployeeInsightCard({ className, insight, ...props }: EmployeeInsightCardProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col justify-center items-center rounded-md border bg-gray-100/10 border-white/40 gap-0.5 p-6 py-3',
        className
      )}
      {...props}>
      <h5 className="mb-1">
        {insight.first_name} {insight.last_name} ({insight.details.department || 'N/A'})
      </h5>

      <Progress value={insight.completion_percentage} className="my-1.5 h-1.5" />

      <span className="mb-1.5 text-center">
        Completed Tasks: {insight.completed_tasks} / {insight.total_tasks}
      </span>

      <Chip color={insight.overdue_tasks ? 'danger' : 'success'} variant="flat" className="text-xs sm:text-sm">
        {insight.overdue_tasks || 'No'} Task{insight.overdue_tasks === 1 ? '' : 's'} Overdue
      </Chip>
    </div>
  );
}

export function EmployeeInsights() {
  const [page, setPage] = useState(1);

  const [reachedEnd, setReachedEnd] = useState<boolean>(false);

  const [ref, inView] = useInView();

  const [docs, setDocs] = useState<IEmployeeInsight[]>([]);

  const selectedDepartment = useAnalyticsStore((state) => state.selectedDepartment);

  const { isLoading, isFetching } = useGetEmployeeInsights({
    page,
    limit: LIMIT_9,
    params: {
      [`${FILTER}[department]`]: selectedDepartment
    },
    onSuccess: (data) => {
      setDocs([...docs, ...data.docs]);
      if (!data.docs?.length || data.docs.length < LIMIT_9) {
        setReachedEnd(true);
      } else {
        setPage(page + 1);
      }
    }
  });

  useEffect(() => {
    if (inView && !isFetching) {
      setPage(page + 1);
    }
  }, [inView, isFetching]);

  return (
    <div className="flex flex-col items-center gap-8">
      <Chip
        color="default"
        variant="bordered"
        className="text-lg py-5 px-6"
        startContent={<ChartNoAxesCombined className="w-6 h-6" />}>
        Employee Insights
      </Chip>
      {!isLoading && !docs.length ? (
        <PackageOpen className="mt-12 stroke-[1px]" size={150} />
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:flex-row justify-center items-center gap-4">
          {docs.map((doc) => (
            <EmployeeInsightCard key={doc.id} insight={doc} />
          ))}
        </div>
      )}
      {!reachedEnd && (
        <div
          ref={ref}
          className="col-span-1 mt-16 mb-12 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
          <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
