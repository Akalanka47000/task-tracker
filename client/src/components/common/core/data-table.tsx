import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Loader2
} from 'lucide-react';
import { Button, Skeleton } from '@/components';
import { LIMIT, LIMIT_8, PAGE, SORT } from '@/constants';
import { cn } from '@/utils';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableColumn,
  TableHeader,
  TableHeaderProps,
  TableProps,
  TableRow
} from '@heroui/react';
import { UseQueryResult } from '@tanstack/react-query';
import {
  Column,
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';

export interface DataTableProps {
  columns: ColumnDef<any>[];
  filters?: React.ReactNode;
  useDataFetcher: {
    fn: <T>(...args: any[]) => UseQueryResult<PaginatedResult<T>>;
    params: Record<string, any>;
    onSuccess?: (data: PaginatedResult<any>) => void;
  };
  pageSize?: number;
  paginate?: boolean;
  className?: string;
  filterContainerClassName?: string;
  endComponentClassName?: string;
  /** A react component which will render on the top right side of the table */
  endComponent?: React.ReactNode;
  tableProps?: {
    root?: Partial<TableProps>;
    header?: Partial<TableHeaderProps<HTMLTableSectionElement>>;
    body?: Partial<TableBodyProps<HTMLTableSectionElement>>;
  };
}

export function DataTable({
  columns,
  filters,
  useDataFetcher,
  pageSize = LIMIT_8,
  paginate = true,
  className,
  filterContainerClassName,
  endComponentClassName,
  endComponent,
  tableProps
}: DataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const initialSortingState = useMemo(() => {
    const defaultSortColumns: (ColumnSort & { priority: number })[] = [];
    columns.forEach((c) => {
      if ((c.meta as any)?.defaultSort) {
        defaultSortColumns.push({
          id: (c as any).accessorKey,
          desc: (c.meta as any).defaultSort === 'DESC',
          priority: (c.meta as any).defaultSortPriority
        });
      }
    });
    defaultSortColumns.sort((a, b) => b.priority - a.priority);
    return defaultSortColumns as SortingState;
  }, []);

  const [sorting, setSorting] = useState<SortingState>(initialSortingState);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  });

  const { data, isFetching, isLoading } = useDataFetcher.fn({
    ...(paginate && {
      [PAGE]: pagination.pageIndex + 1,
      [LIMIT]: pagination.pageSize
    }),
    params: {
      ...useDataFetcher.params,
      ...sorting.reduce(
        (acc, curr) => {
          acc[SORT][curr.id] = curr.desc ? 'DESC' : 'ASC';
          return acc;
        },
        {
          [SORT]: {} as Record<string, string>
        }
      )
    }
  });

  useEffect(() => {
    if (paginate) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0
      }));
    }
  }, [useDataFetcher.params, paginate]);

  useEffect(() => {
    if (useDataFetcher.onSuccess && data) useDataFetcher.onSuccess(data);
  }, [useDataFetcher.onSuccess, data]);

  const table = useReactTable({
    data: (paginate ? data?.docs : (data as any)) ?? [],
    columns,
    rowCount: data?.totalDocs ?? (data as any)?.length ?? 0,
    onPaginationChange: setPagination,
    manualPagination: true,
    isMultiSortEvent: () => true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <>
      <div className={cn('h-full w-full flex flex-col gap-4', className)}>
        <div className="flex flex-col gap-4 grow">
          <div className={cn('flex items-center gap-4', filterContainerClassName)}>
            {filters}
            <div className={cn('ml-auto flex items-center justify-end gap-4', endComponentClassName)}>
              {endComponent}
            </div>
          </div>
          <div className="rounded-md">
            <Table {...tableProps?.root}>
              <TableHeader {...tableProps?.header}>
                {table.getFlatHeaders().map((header) => {
                  const meta = header.column.columnDef.meta as any;
                  return (
                    <TableColumn
                      key={header.id}
                      className={cn('px-4', meta?.headerClassName, meta?.className)}
                      style={{ minWidth: `${header.column.columnDef.minSize}px` }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableColumn>
                  );
                })}
              </TableHeader>
              <TableBody {...tableProps?.body}>
                {isLoading &&
                  (Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton className="w-full h-8" />
                      </TableCell>
                    </TableRow>
                  )) as any)}
                {!isLoading ? (
                  table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        className={cn('transition duration-150', isFetching && 'opacity-50 pointer-events-none')}
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as any;
                          return (
                            <TableCell key={cell.id} className={cn('px-4', meta?.cellClassName, meta?.className)}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {paginate && (
          <div className="flex items-center justify-end space-x-2">
            {isFetching ? (
              <Loader2 className="animate-spin" />
            ) : (
              data?.docs && (
                <div className="mr-4 text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + (table.getPageCount() ? 1 : 0)} of{' '}
                  {table.getPageCount().toLocaleString()}
                </div>
              )
            )}
            <div className="h-full flex gap-4 items-center">
              <Button
                variant="flat"
                size="sm"
                className="rounded-full w-8 min-w-8 p-0"
                onPress={() => table.firstPage()}
                isDisabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="solid"
                size="sm"
                className="rounded-full w-8 min-w-8 p-0"
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="solid"
                className="rounded-full w-8 min-w-8 p-0"
                size="sm"
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="flat"
                className="rounded-full w-8 min-w-8 p-0"
                size="sm"
                onPress={() => table.lastPage()}
                isDisabled={!table.getCanNextPage()}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  const iconClassName = 'ml-1.5 h-4 w-4';
  const meta = column?.columnDef?.meta as any;
  return (
    <div className={cn('flex items-center space-x-2', className, meta?.headerClassName, meta?.className)}>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="flat"
            size="sm"
            className=" h-6 data-[state=open]:bg-accent ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowUp className={iconClassName} />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowDown className={iconClassName} />
            ) : (
              <ChevronsUpDown className={iconClassName} />
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="asc"
            onPress={() => column.toggleSorting(false)}
            className="flex text-center justify-center">
            Asc
          </DropdownItem>
          <DropdownItem
            key="desc"
            onPress={() => column.toggleSorting(true)}
            className="flex text-center justify-center">
            Desc
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default DataTable;
