import React from 'react';

// TODO: move reusable to stripes-acq-components;

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

export const CLAIM_FIELDS = {
  id: 'id',
  receivingStatus: 'receivingStatus',
  title: 'title',
  expectedReceiptDate: 'poLine.physical.expectedReceiptDate',
};

export const CLAIMING_LIST_SORTABLE_FIELDS: (keyof ACQ.Claim)[] = [];
export const CLAIMING_LIST_COLUMN_MAPPING = {
  [CLAIM_FIELDS.receivingStatus]: 'receivingStatus',
  [CLAIM_FIELDS.title]: 'title',
  [CLAIM_FIELDS.expectedReceiptDate]: 'expectedReceiptDate',
} as Record<keyof ACQ.Claim, React.ReactNode>;

export const FILTERS = {
  ACQUISITIONS_UNIT: 'purchaseOrder.acqUnitIds',
  BINDERY_ACTIVE: 'poLine.details.isBinderyActive',
  CREATED_BY: 'metadata.createdByUserId',
  DATE_CREATED: 'metadata.createdDate',
  DATE_UPDATED: 'metadata.updatedDate',
  EXPECTED_RECEIPT_DATE: 'pieces.receiptDate',
  LOCATION: 'poLine.locations',
  MATERIAL_TYPE: 'materialType',
  ORDER_FORMAT: 'poLine.orderFormat',
  ORDER_ORGANIZATION: 'purchaseOrder.vendor',
  ORDER_STATUS: 'purchaseOrder.workflowStatus',
  ORDER_TYPE: 'purchaseOrder.orderType',
  PIECE_CREATED_BY: 'pieces.metadata.createdByUserId',
  PIECE_DATE_CREATED: 'pieces.metadata.createdDate',
  PIECE_DATE_UPDATED: 'pieces.metadata.updatedDate',
  PIECE_UPDATED_BY: 'pieces.metadata.updatedByUserId',
  POL_TAGS: 'poLine.tags.tagList',
  RECEIPT_DUE: 'poLine.physical.receiptDue',
  RECEIVED_DATE: 'pieces.receivedDate',
  RECEIVING_STATUS: 'pieces.receivingStatus',
  RUSH: 'poLine.rush',
  UPDATED_BY: 'metadata.updatedByUserId',
} as const;

export const ORDER_FORMAT_MATERIAL_TYPE_MAP = {
  [ORDER_FORMATS.electronicResource]: ['poLine.eresource.materialType'],
  [ORDER_FORMATS.physicalResource]: ['poLine.physical.materialType'],
  [ORDER_FORMATS.PEMix]: ['poLine.eresource.materialType', 'poLine.physical.materialType'],
  [ORDER_FORMATS.other]: ['poLine.physical.materialType'],
} as const;