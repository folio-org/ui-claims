import React from 'react';

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
