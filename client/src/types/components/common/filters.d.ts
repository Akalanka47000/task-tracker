export interface FilterOption {
  key: string | number;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label?: string;
  placeholder?: string;
  value?: any;
  options?: FilterOption[];
  compoundOperator?: string;
  secondary?: boolean;
  operator?: string;
  inputType?: string;
  showFormLabel?: boolean;
  className?: string;
}

export interface FilterProps {
  definitions: FilterDefinition[];
  setFilters: (filters: Record<string, any>) => void;
  action?: React.ReactNode;
  styles?: {
    root?: string;
    filter?: string;
  };
  drawer?: boolean;
}

export interface FilterContentProps extends Partial<FilterProps> {
  filtersLocalState: FilterDefinition[];
  setFiltersLocalState: (filters: FilterDefinition[]) => void;
}
