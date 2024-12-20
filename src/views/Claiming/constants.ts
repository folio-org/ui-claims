import {
  CUSTOM_FIELDS_FILTER,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

export const CLAIMING_LIST_COLUMNS = {
  select: 'select',
  receiptDate: 'receiptDate',
  vendorCode: 'vendorCode',
  vendorName: 'vendorName',
  receivingStatus: 'receivingStatus',
  title: 'title',
  displaySummary: 'displaySummary',
  chronology: 'chronology',
  enumeration: 'enumeration',
  poLineNumber: 'poLineNumber',
} as const;

export const CLAIMING_LIST_SORTABLE_FIELDS = [
  CLAIMING_LIST_COLUMNS.receiptDate,
  CLAIMING_LIST_COLUMNS.receivingStatus,
  CLAIMING_LIST_COLUMNS.displaySummary,
  CLAIMING_LIST_COLUMNS.chronology,
  CLAIMING_LIST_COLUMNS.enumeration,
] as const;

export const FILTERS = {
  ORDER_ORGANIZATION: 'purchaseOrder.vendor',
  ORDER_TYPE: 'purchaseOrder.orderType',
  MATERIAL_TYPE: 'titles.materialType',
  ORDER_FORMAT: 'poLine.orderFormat',
  POL_TAGS: 'poLine.tags.tagList',
  LOCATION: 'poLine.locations',
  POL_CLAIMING_ACTIVE: 'poLine.claimingActive',
  RECEIVING_STATUS: 'receivingStatus',
  ACQUISITIONS_UNIT: 'purchaseOrder.acqUnitIds',
  RUSH: 'poLine.rush',
  EXPECTED_RECEIPT_DATE: 'receiptDate',
  RECEIPT_DUE: 'poLine.physical.receiptDue',
  RECEIVED_DATE: 'receivedDate',
  PIECE_CREATED_BY: 'metadata.createdByUserId',
  PIECE_DATE_CREATED: 'metadata.createdDate',
  PIECE_DATE_UPDATED: 'metadata.updatedDate',
  PIECE_UPDATED_BY: 'metadata.updatedByUserId',
  TITLE_CREATED_BY: 'titles.metadata.createdByUserId',
  TITLE_DATE_CREATED: 'titles.metadata.createdDate',
  TITLE_DATE_UPDATED: 'titles.metadata.updatedDate',
  TITLE_UPDATED_BY: 'titles.metadata.updatedByUserId',
  SHIP_TO: 'purchaseOrder.shipTo',
  CUSTOM_FIELDS: `poLine.${CUSTOM_FIELDS_FILTER}`,
} as const;

export const ORDER_FORMAT_MATERIAL_TYPE_MAP = {
  [ORDER_FORMATS.electronicResource]: ['poLine.eresource.materialType'],
  [ORDER_FORMATS.physicalResource]: ['poLine.physical.materialType'],
  [ORDER_FORMATS.PEMix]: ['poLine.eresource.materialType', 'poLine.physical.materialType'],
  [ORDER_FORMATS.other]: ['poLine.physical.materialType'],
} as const;

export const RESPONSE_ERROR_CODE = {
  cannotFindPiecesWithLatestStatusToProcess: 'cannotFindPiecesWithLatestStatusToProcess',
  genericError: 'genericError',
  unableToGenerateClaimsForOrgNoIntegrationDetails: 'unableToGenerateClaimsForOrgNoIntegrationDetails',
} as const;
