import React from 'react';

import { NotificationsCenterMainNav } from '../components';

interface RenderProps {
  renderTrigger?: (extraProps?: Record<string, unknown>) => React.ReactNode;
  triggerProps?: Record<string, unknown>;
}

export const renderNotificationsCenter = (props: RenderProps = {}) => {
  return <NotificationsCenterMainNav {...props} />;
};