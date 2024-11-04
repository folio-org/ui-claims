import React from 'react';

interface ClaimingListFiltersProps {
  activeFilters: { [key: string]: string },
  applyFilters: () => void,
  disabled: boolean
}

const ClaimingListFilters: React.FC<ClaimingListFiltersProps> = ({

}) => {
  return (
    <div>
      <h1>ClaimingListFilters</h1>
    </div>
  );
};

export default ClaimingListFilters;