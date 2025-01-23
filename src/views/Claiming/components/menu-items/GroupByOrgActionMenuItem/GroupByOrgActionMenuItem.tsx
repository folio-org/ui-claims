import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

interface GroupByOrgActionMenuItemProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const GroupByOrgActionMenuItem:React.FC<GroupByOrgActionMenuItemProps> = ({
  onClick,
}) => {
  return (
    <Button
      data-testid="group-by-org-button"
      buttonStyle="dropdownItem"
      onClick={onClick}
    >
      <Icon icon="house">
        <FormattedMessage id="ui-claims.claiming.action.groupByOrganization" />
      </Icon>
    </Button>
  );
};
