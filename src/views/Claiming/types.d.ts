import { FILTERS } from './constants';

export type FilterKey = typeof FILTERS[keyof typeof FILTERS];

export type ActiveFilters = Partial<Record<FilterKey, FilterValue>>;
