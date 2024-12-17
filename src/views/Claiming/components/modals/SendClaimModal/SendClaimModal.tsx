import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Modal,
} from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

interface SendClaimModalProps {
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  open: boolean;
  selectedRecordsCount: number;
}

const SendClaimModal: React.FC<SendClaimModalProps> = ({
  disabled,
  onCancel,
  onSubmit,
  open,
  selectedRecordsCount,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage(
    { id: 'ui-claims.claiming.sendClaim.modal.heading' },
    { count: selectedRecordsCount },
  );

  const start = (
    <Button
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );
  const end = (
    <Button
      buttonStyle="primary"
      disabled={disabled}
      marginBottom0
      onClick={onSubmit}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.save" />
    </Button>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      aria-label={modalLabel}
      footer={footer}
      id="send-claim-modal"
      label={modalLabel}
      open={open}
      size="small"
    >
      <FormattedMessage
        id="ui-claims.claiming.sendClaim.modal.message"
        values={{ count: selectedRecordsCount }}
      />
    </Modal>
  );
};

export default SendClaimModal;
