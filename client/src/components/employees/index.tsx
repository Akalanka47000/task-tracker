import { useState } from 'react';
import { Button, DataTable, Filters } from '@/components';
import { useGetEmployees } from '@/hooks';
import { useUserStore } from '@/store/user';
import { columns } from './columns';
import { testIds as createDialogTestIds, default as CreateOrUpdateDialog } from './create-dialog';
import { default as DeleteDialog } from './delete';
import { dataAttributes } from '@/constants';

export const testIds = {
  ...createDialogTestIds,
  userList: 'user-list',
  createButton: 'user-create-button'
};

export function EmployeeTable() {
  const openUserDialogWithSelector = useUserStore((state) => state.openUserDialogWithSelector);

  const [filters, setFilters] = useState({});

  return (
    <>
      <DataTable
        columns={columns}
        filters={
          <Filters
            definitions={[
              {
                key: 'id',
                placeholder: 'Search by Employee ID...'
              }
            ]}
            setFilters={setFilters}
          />
        }
        useDataFetcher={{
          fn: useGetEmployees as any,
          params: filters
        }}
        endComponent={
          <Button
            onPress={() => openUserDialogWithSelector(undefined)}
            data-testid={testIds.createButton}
          >
            Add Employee
          </Button>
        }
        tableProps={{
          body: {
            [dataAttributes.testId]: testIds.userList
          }
        }}
      />
      <CreateOrUpdateDialog />
      <DeleteDialog />
    </>
  );
}

export default EmployeeTable;
