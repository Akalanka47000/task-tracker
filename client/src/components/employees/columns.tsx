import { useNavigate } from 'react-router-dom';
import { Copy, Ellipsis, FileSliders, Pen, Trash2 } from 'lucide-react';
import { Button } from '@/components';
import { DataTableColumnHeader, DepartmentBadge } from '@/components/common';
import { ROUTE_TASKS } from '@/constants';
import { useUserStore } from '@/store/user';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { addToast } from '@heroui/react';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'id',
    header: 'Employee ID',
    cell: (data) => {
      const onCopy = () => {
        navigator.clipboard.writeText(data.row.original.id);
        addToast({ title: 'Employee ID copied to clipboard', color: 'primary' });
      };
      return (
        <div className="flex gap-2 items-center">
          <span>{data.row.original.id.slice(0, 8)}...</span>
          <Copy className="w-4 h-4 cursor-pointer hover:text-primary transition-all duration-300" onClick={onCopy} />
        </div>
      );
    }
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name'
  },
  {
    accessorKey: 'username',
    header: 'Username',
    meta: {
      cellClassName: 'text-foreground'
    }
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: (data) => <DepartmentBadge department={data.row.original.details.department ?? 'N/A'} />,
    meta: {
      className: 'text-center'
    },
    enableSorting: true
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Onboarded Date" className="justify-center" />,
    cell: (data) =>
      new Date(data.row.original.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
    meta: {
      className: 'text-center'
    },
    enableSorting: true
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: (data) => (
      <div className="flex justify-end">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              color="default"
              size="sm"
              className="min-w-8 p-0 focus-visible:ring-0 focus-visible:ring-transparent">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="edit" className="p-0">
              <EditUser data={data.row.original} />
            </DropdownItem>
            <DropdownItem key="delete" className="p-0">
              <DeleteUser data={data.row.original} />
            </DropdownItem>
            <DropdownItem key="view-tasks" className="p-0">
              <ViewTasks data={data.row.original} />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
];

function EditUser({ data }: { data: IUser }) {
  const openUserDialogWithSelector = useUserStore((store) => store.openUserDialogWithSelector);

  const handleEdit = () => openUserDialogWithSelector(data);

  return (
    <div className="flex items-center gap-2 p-1.5" onClick={handleEdit}>
      <Pen className="h-4 w-4" />
      Edit
    </div>
  );
}

function DeleteUser({ data }: { data: IUser }) {
  const openUserDeleteDialogWithSelector = useUserStore((store) => store.openUserDeleteDialogWithSelector);

  const handleDelete = () => openUserDeleteDialogWithSelector(data);

  return (
    <div className="flex items-center gap-2 p-1.5" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
      Delete
    </div>
  );
}

function ViewTasks({ data }: { data: IUser }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 p-1.5" onClick={() => navigate(`${ROUTE_TASKS}?employee_id=${data.id}`)}>
      <FileSliders className="h-4 w-4" />
      Manage Tasks
    </div>
  );
}
