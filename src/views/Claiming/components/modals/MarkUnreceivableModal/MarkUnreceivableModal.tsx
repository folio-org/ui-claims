import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

interface MarkUnreceivableModalProps {
  claimsCount: number;
  disabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  open: boolean;
}

export const MarkUnreceivableModal: React.FC<MarkUnreceivableModalProps> = ({
  claimsCount,
  disabled,
  onCancel,
  onSubmit,
  open,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-claims.claiming.markUnreceivable.modal.heading' });

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
      id="mark-unreceivable-modal"
      size="small"
      footer={footer}
      label={modalLabel}
      aria-label={modalLabel}
    >
      <Row>
        <Col xs>
          <FormattedMessage
            id="ui-claims.claiming.markUnreceivable.modal.message"
            values={{ count: claimsCount }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
