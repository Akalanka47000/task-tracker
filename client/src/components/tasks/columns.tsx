import { CircleCheckBig, Ellipsis, Expand, Loader2, Pen, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components';
import { DataTableColumnHeader, PriorityBadge } from '@/components/common';
import { useToggleTaskStatus } from '@/hooks';
import { useTaskStore } from '@/store/task';
import { cn } from '@/utils';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Checkbox, Tooltip } from '@heroui/react';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ITask>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (data) => <span className={cn(data.row.original.completed && 'line-through')}>{data.row.original.name}</span>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (data) => {
      const chars = 35;
      return (
        <div className="flex gap-2 items-center">
          <span>
            {data.row.original.description.slice(0, chars)}
            {data.row.original.description.length > chars && '...'}
          </span>
          {data.row.original.description.length > chars && (
            <Tooltip content={data.row.original.description} className="w-1/2 rounded-md p-4" color="primary">
              <Expand className="w-4 h-4 text-primary" />
            </Tooltip>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" className="justify-center" />,
    cell: (data) => <PriorityBadge priority={data.row.original.priority} />,
    meta: {
      className: 'text-center',
      defaultSort: 'DESC',
      defaultSortPriority: 0
    },
    enableSorting: true
  },
  {
    accessorKey: 'completed',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Completed" className="justify-center" />,
    cell: (data) => {
      const mutation = useToggleTaskStatus(data.row.original);
      return <Checkbox isSelected={data.row.original.completed} onChange={mutation.mutate as any} />;
    },
    meta: {
      className: 'text-center',
      defaultSort: 'ASC',
      defaultSortPriority: 2
    },
    sortDescFirst: false,
    enableSorting: true
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" className="justify-center" />,
    cell: (data) =>
      new Date(data.row.original.due_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    meta: {
      className: 'text-center',
      defaultSort: 'DESC',
      defaultSortPriority: 1
    },
    enableSorting: true
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned Date" className="justify-center" />,
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
    sortDescFirst: true,
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
            <DropdownItem key="edit">
              <EditTask data={data.row.original} />
            </DropdownItem>
            <DropdownItem key="delete">
              <DeleteTask data={data.row.original} />
            </DropdownItem>
            <DropdownItem key="mark-as-complete">
              <MarkTaskAsCompleted data={data.row.original} />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
];

function EditTask({ data }: { data: ITask }) {
  const openTaskDialogWithSelector = useTaskStore((store) => store.openTaskDialogWithSelector);

  const handleEdit = () => openTaskDialogWithSelector(data);

  return (
    <div className="flex items-center gap-2" onClick={handleEdit}>
      <Pen className="h-4 w-4" />
      Edit
    </div>
  );
}

function DeleteTask({ data }: { data: ITask }) {
  const openTaskDeleteDialogWithSelector = useTaskStore((store) => store.openTaskDeleteDialogWithSelector);

  const handleDelete = () => openTaskDeleteDialogWithSelector(data);

  return (
    <div className="flex items-center gap-2" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
      Delete
    </div>
  );
}

function MarkTaskAsCompleted({ data }: { data: ITask }) {
  const mutation = useToggleTaskStatus(data);
  return (
    <div
      className={cn('flex items-center gap-2', mutation.isPending && 'pointer-events-none')}
      onClick={mutation.mutate as any}>
      {mutation.isPending ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : data.completed ? (
        <RotateCcw className="h-4 w-4" />
      ) : (
        <CircleCheckBig className="h-4 w-4" />
      )}
      {data.completed ? 'Reset Task' : 'Mark Task as Completed'}
    </div>
  );
}
