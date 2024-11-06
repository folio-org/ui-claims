/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./definitions/index.d.ts" />

interface Dimensions {
  height: number;
  width: number;
}

type FilterValue = string | string[];

interface Pagination {
  limit: number;
  offset: number;
}

type SortingOrder = 'ascending' | 'descending';

interface Sorting {
  sorting: string;
  sortingDirection: SortingOrder;
}

interface Tags {
  tagList: string[];
}

interface Metadata {
  createdDate: string;
  createdByUserId?: string;
  createdByUsername?: string;
  updatedDate?: string;
  updatedByUserId?: string;
  updatedByUsername?: string;
}
