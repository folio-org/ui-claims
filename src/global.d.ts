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
