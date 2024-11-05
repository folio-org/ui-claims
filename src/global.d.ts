declare namespace ACQ {
  type PieceFormat = 'Physical' | 'Electronic' | 'Other';
  type PieceReceivingStatus = 'Received'
    | 'Expected'
    | 'Late'
    | 'Claim delayed'
    | 'Claim sent'
    | 'Unreceivable'

  interface Piece {
    id: string;
    // Display summary information.
    displaySummary?: string;
    // Free form commentary.
    comment?: string;
    // The format of the piece.
    format: PieceFormat;
    // UUID of the associated item record.
    itemId?: string;
    // UUID of the associated bind item record.
    bindItemId?: string;
    // Bind item tenant for ECS-enabled clusters.
    bindItemTenantId?: string;
    // UUID of the (inventory) location record.
    locationId?: string;
    // UUID of the (inventory) holding record.
    holdingId?: string;
    // UUID of the associated purchase order line.
    poLineId: string;
    // UUID of the receiving title record.
    titleId: string;
    // The status of the piece.
    receivingStatus: PieceReceivingStatus;
    // Receiving tenant for ECS-enabled clusters.
    receivingTenantId?: string;
    // Whether or not receiving history should be displayed in holding record view.
    displayOnHolding?: boolean;
    // Whether or not the piece data should display to patrons at point of receipt.
    displayToPublic?: boolean;
    // Descriptive information for the numbering scheme of a serial. Synchronized with inventory item.
    enumeration?: string;
    // Descriptive information for the dating scheme of a serial. Synchronized with inventory item.
    chronology?: string;
    // Descriptive information for the barcode of a serial. Synchronized with inventory item.
    barcode?: string;
    // Descriptive information for the accession number of a serial. Synchronized with inventory item.
    accessionNumber?: string;
    // Descriptive information for the call number of a serial. Synchronized with inventory item.
    callNumber?: string;
    // Records the fact that the record should not be displayed in a discovery system.
    discoverySuppress?: boolean;
    // Copy number of the piece.
    copyNumber?: string;
    // Whether or not this is supplementary material.
    supplement?: boolean;
    // Whether or not piece has already been bound.
    isBound?: boolean;
    // Date that associated item is expected to arrive.
    receiptDate?: string;
    // The date associated item is actually received.
    receivedDate?: string;
    // Date when the status of this piece was last updated.
    statusUpdatedDate?: string;
    // Time interval (in days) for processing claims related to this piece.
    claimingInterval?: number;
    // Internal note for "Send claim" action.
    internalNote?: string;
    // External note for "Send claim" action to share with a vendor.
    externalNote?: string;
    // Metadata about creation and changes to records, provided by the server (client should not provide).
    metadata?: Metadata;
  }

  interface Claim extends Piece {
    title: string;
    vendorCode: string;
    vendorName: string;
    poLineNumber: string;
    piecesToClaim: number;
  }
}

interface Dimensions {
  height: number;
  width: number;
}

type FilterValue = string | string[];

interface Pagination {
  limit: number;
  offset: number;
}

type Sorting = {
  field: string;
  order: 'ascending' | 'descending';
};

interface Metadata {
  createdDate: string;
  createdByUserId?: string;
  createdByUsername?: string;
  updatedDate?: string;
  updatedByUserId?: string;
  updatedByUsername?: string;
}
