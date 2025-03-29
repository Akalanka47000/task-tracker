import { useState } from 'react';
import { Button, DataTable, Filters } from '@/components';
import { dataAttributes } from '@/constants';
import { useGetEmployees, useMediaQuery } from '@/hooks';
import { cn } from '@/utils';
import { columns } from './columns';
// import { testIds as createDialogTestIds, default as CreateOrUpdateDialog } from './create-dialog';
// import { default as DeleteDialog } from './delete';

export const testIds = {
  // ...createDialogTestIds,
  taskList: 'task-list',
  createButton: 'task-create-button'
};

export function EmployeeTable() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [filters, setFilters] = useState({});

  return (
    <>
      <DataTable
        columns={columns}
        filters={
          <Filters
            definitions={[
              {
                key: 'first_name',
                placeholder: 'Search...',
                regexp: true
              },
            ]}
            setFilters={setFilters}
          />
        }
        useDataFetcher={{
          fn: useGetEmployees as any,
          params: filters
        }}
        // endComponent={
        //   <CreateOrUpdateDialog>
        //     <Button variant="solid" {...{ [dataAttributes.testId]: testIds.createButton }}>
        //       Add Employee
        //     </Button>
        //   </CreateOrUpdateDialog>
        // }
        filterContainerClassName={cn(isMobile && 'justify-end')}
        endComponentClassName={cn(isMobile && 'ml-0')}
        tableProps={{
          body: {
            [dataAttributes.testId]: testIds.taskList
          }
        }}
      />
      {/* <DeleteDialog /> */}
    </>
  );
}

export default EmployeeTable;