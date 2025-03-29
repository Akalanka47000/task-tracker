import { useState } from 'react';
import { UserRole } from '@shared/constants';
import { Button, DataTable, Filters } from '@/components';
import { dataAttributes, FILTER } from '@/constants';
import { useGetProfile, useGetTasks } from '@/hooks';
import { useTaskStore } from '@/store/task';
import { columns } from './columns';
import { testIds as createDialogTestIds, default as CreateOrUpdateDialog } from './create-dialog';
import { default as DeleteDialog } from './delete';

export const testIds = {
  ...createDialogTestIds,
  taskList: 'task-list',
  createButton: 'task-create-button'
};

export function TaskTable({ employeeId }: { employeeId?: string | null }) {
  const openTaskDialogWithSelector = useTaskStore((state) => state.openTaskDialogWithSelector);

  const { data: profile } = useGetProfile();

  const [filters, setFilters] = useState({});

  return (
    <>
      <DataTable
        columns={columns}
        filters={
          <Filters
            definitions={[
              {
                key: 'name',
                placeholder: 'Search by name...'
              }
            ]}
            setFilters={setFilters}
          />
        }
        useDataFetcher={{
          fn: useGetTasks as any,
          params: {
            ...filters,
            [`${FILTER}[employee_id]`]: employeeId
          }
        }}
        endComponent={
          profile?.role === UserRole.Administrator && (
            <Button
              {...{ [dataAttributes.testId]: testIds.createButton }}
              onPress={() => openTaskDialogWithSelector(undefined)}>
              Add Task
            </Button>
          )
        }
        tableProps={{
          body: {
            [dataAttributes.testId]: testIds.taskList
          }
        }}
      />
      <CreateOrUpdateDialog employeeId={employeeId} />
      <DeleteDialog />
    </>
  );
}

export default TaskTable;
