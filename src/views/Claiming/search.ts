import compact from 'lodash/compact';
import flatten from 'lodash/flatten';

import {
  buildArrayFieldQuery,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import { ALL_RECORDS_CQL } from '../../constants';
import {
  FILTERS,
  ORDER_FORMAT_MATERIAL_TYPE_MAP,
} from './constants';

import type { ActiveFilters } from './types';

export const CLAIMING_SEARCHABLE_INDICES = [
  'titles.title',
  'poLine.titleOrPackage',
  'titles.productIds',
  'purchaseOrder.poNumber',
  'poLine.poLineNumber',
  'poLine.vendorDetail.referenceNumbers',
];

export const getKeywordQuery = (query: string): string => CLAIMING_SEARCHABLE_INDICES.reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}=="*${query}*"`;
    } else {
      return `${sIndex}=="*${query}*"`;
    }
  },
  '',
);

// TOOD: fix filters
export const buildClaimingQuery = (filters: ActiveFilters, sorting: ACQ.Sorting): string => {
  let materialTypeFilterQuery: string | undefined;

  const materialType = filters[FILTERS.MATERIAL_TYPE];
  const orderFormat = filters[FILTERS.ORDER_FORMAT];

  if (materialType && orderFormat) {
    materialTypeFilterQuery = flatten([orderFormat]).map((format) => {
      const orderFormatQuery = `poLine.orderFormat=="${format}"`;

      const materialTypeQuery: string = ORDER_FORMAT_MATERIAL_TYPE_MAP[format]
        .map((materialTypeCql: string) => `${materialTypeCql}=="${materialType}"`)
        .join(' or ');

      return `(${orderFormatQuery} and (${materialTypeQuery}))`;
    }).join(' or ');

    materialTypeFilterQuery = `(${materialTypeFilterQuery})`;
  } else if (materialType) {
    materialTypeFilterQuery = `(poLine.eresource.materialType=="${materialType}" or poLine.physical.materialType=="${materialType}")`;
  }

  if (materialTypeFilterQuery) {
    filters[FILTERS.MATERIAL_TYPE] = undefined;
    filters[FILTERS.ORDER_FORMAT] = undefined;
  }

  const filtersFilterQuery = buildFilterQuery(
    filters,
    (query: string, qindex?: string) => {
      if (qindex) {
        return `(${qindex}==*${query}*)`;
      }

      return getKeywordQuery(query);
    },
    {
      [FILTERS.TITLE_DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.TITLE_DATE_CREATED]),
      [FILTERS.TITLE_DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.TITLE_DATE_UPDATED]),
      [FILTERS.PIECE_DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.PIECE_DATE_CREATED]),
      [FILTERS.PIECE_DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.PIECE_DATE_UPDATED]),
      [FILTERS.EXPECTED_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_RECEIPT_DATE]),
      [FILTERS.RECEIVED_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIVED_DATE]),
      [FILTERS.RECEIPT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIPT_DUE]),
      [FILTERS.LOCATION]: (filterValue: ACQ.FilterValue) => `(${
        [FILTERS.LOCATION, 'poLine.searchLocationIds']
          .map((filterKey) => buildArrayFieldQuery(filterKey, filterValue))
          .join(' or ')
      })`,
      [FILTERS.POL_TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.POL_TAGS]),
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
    },
  );

  const filterQuery = compact([filtersFilterQuery, materialTypeFilterQuery]).join(' and ') || ALL_RECORDS_CQL;
  const sortingQuery = buildSortingQuery(sorting) || 'sortby receiptDate/sort.ascending';

  return connectQuery(filterQuery, sortingQuery);
};
