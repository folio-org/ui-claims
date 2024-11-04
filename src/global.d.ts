declare namespace ACQ {
  interface Piece {
    id: string;
    receivingStatus: string;
  }

  interface Claim extends Piece {
    title: string;
    expectedReceiptDate: string;
  }
}

interface Pagination {
  limit: number;
  offset: number;
}

interface Dimensions {
  height: number;
  width: number;
}
