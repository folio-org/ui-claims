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

interface DelayClaimModalProps {
  disabled: boolean;
  modalLabel?: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  open: boolean;
}

const DelayClaimModal: React.FC<DelayClaimModalProps> = ({
  disabled,
  modalLabel: modalLabelProp,
  onCancel,
  onSubmit,
  open,
}) => {
  const intl = useIntl();
  const modalLabel = modalLabelProp ?? intl.formatMessage({ id: 'ui-claims.claiming.delayClaim.modal.heading' });

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
      onClick={onSubmit}
      marginBottom0
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
      open={open}
      id="delay-claim-modal"
      size="small"
      footer={footer}
      label={modalLabel}
      aria-label={modalLabel}
    >
      {/* TODO: UICLAIM-4 */}
    </Modal>
  );
};

export default DelayClaimModal;
