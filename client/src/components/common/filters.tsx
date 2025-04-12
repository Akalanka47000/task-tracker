import { useCallback, useEffect, useState } from 'react';
import { default as debounce } from 'lodash/debounce';
import { Input } from '@/components';
import { EQ, FILTER } from '@/constants';
import { FilterContentProps, FilterDefinition, FilterProps } from '@/types';
import { cn } from '@/utils';
import { Select, SelectItem } from '@heroui/react';

export function computeFilters(filters: FilterDefinition[]) {
  return filters.reduce((acc: Record<string, any>, curr) => {
    const key = `${FILTER}[${curr.compoundOperator ?? curr.key}]`;
    if (curr.value) {
      const value = (curr.operator || EQ).replace(':value', curr.value);
      if (curr.compoundOperator) {
        if (!acc[key]) {
          acc[key] = `${curr.key}=${value}`;
        } else {
          acc[key] = `${acc[key]},${curr.key}=${value}`;
        }
      } else {
        acc[key] = value;
      }
    } else {
      if (!curr.compoundOperator) {
        delete acc[key];
      }
    }
    return acc;
  }, {});
}
export function FilterContent({
  filtersLocalState,
  setFiltersLocalState,
  action,
  styles = {},
  drawer
}: FilterContentProps) {
  const onBaseFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersLocalState(
      filtersLocalState.map((filter) => {
        if (filter.key === e.target.name) filter.value = e.target.value;
        return filter;
      })
    );
  };

  const onFilterChange = useCallback(drawer ? onBaseFilterChange : debounce(onBaseFilterChange, 300), [
    filtersLocalState,
    drawer
  ]);

  return (
    <div className={cn('w-full flex flex-col justify-start items-center gap-6', styles.root)}>
      {action}
      {filtersLocalState.map((filter, index) => {
        return (
          <div key={`filter-${filter.key}-${index}`} className={cn('w-full', styles.filter, filter.className)}>
            <div className="w-full flex flex-col">
              {filter.showFormLabel && <label className="text-xs pb-1.5">{filter.label ?? filter.placeholder} </label>}
              {filter.options ? (
                <Select
                  name={filter.key}
                  value={drawer ? filter.value : undefined}
                  onChange={(e: any) => {
                    onFilterChange({
                      target: {
                        name: filter.key,
                        value: e.target.value
                      }
                    } as any);
                  }}
                  placeholder={filter.placeholder ?? filter.label}>
                  {filter.options.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              ) : (
                <Input
                  value={drawer ? filter.value : undefined}
                  placeholder={filter.placeholder ?? `Search by ${filter.label?.toLowerCase()}`}
                  name={filter.key}
                  type={filter.inputType}
                  onChange={onFilterChange}
                  data-testid={`filter-${filter.key}`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Filters({ drawer, definitions, setFilters, ...props }: FilterProps) {
  const [filtersLocalState, setFiltersLocalState] = useState(JSON.parse(JSON.stringify(definitions)));

  useEffect(() => {
    if (!drawer) {
      setFilters(computeFilters(filtersLocalState));
    }
  }, [filtersLocalState, drawer]);

  useEffect(() => {
    if (definitions.length !== filtersLocalState.length) {
      setFiltersLocalState(JSON.parse(JSON.stringify(definitions)));
    }
  }, [definitions, filtersLocalState]);

  return (
    <FilterContent
      {...props}
      styles={{
        ...props.styles,
        root: cn(props.styles?.root, 'md:flex-row'),
        filter: cn(props.styles?.filter, 'max-w-sm self-start')
      }}
      filtersLocalState={filtersLocalState}
      setFiltersLocalState={setFiltersLocalState}
    />
  );
}

export default Filters;
