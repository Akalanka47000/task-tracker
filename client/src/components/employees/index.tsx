import { useState } from 'react';
import { Button, DataTable, Filters } from '@/components';
import { dataAttributes } from '@/constants';
import { useGetEmployees } from '@/hooks';
import { useUserStore } from '@/store/user';
import { columns } from './columns';
import { testIds as createDialogTestIds, default as CreateOrUpdateDialog } from './create-dialog';
import { default as DeleteDialog } from './delete';

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
            {...{ [dataAttributes.testId]: testIds.createButton }}
            onPress={() => openUserDialogWithSelector(undefined)}>
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
