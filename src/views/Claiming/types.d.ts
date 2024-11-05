import {
  CLAIMING_LIST_COLUMNS,
  FILTERS,
} from './constants';

export type FilterKey = typeof FILTERS[keyof typeof FILTERS];

export type ActiveFilters = Partial<Record<FilterKey, FilterValue>>;

export type ClaimingListColumn = keyof typeof CLAIMING_LIST_COLUMNS;
