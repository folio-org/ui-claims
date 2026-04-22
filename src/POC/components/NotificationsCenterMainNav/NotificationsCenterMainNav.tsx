import React from 'react';

import { Button } from '@folio/stripes/components';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  kind: string;
}

interface Props {
  notifications: NotificationItem[];
  unreadCount: number;
  onIncrementUnreadCount: () => void;
  onDecrementUnreadCount: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const getBadgeColor = (kind: string) => {
  if (kind === 'warning') {
    return '#f59e0b';
  }

  if (kind === 'security') {
    return '#ef4444';
  }

  if (kind === 'action') {
    return '#2563eb';
  }

  return '#6b7280';
};

export const NotificationsCenterMainNav: React.FC<Props> = ({
  notifications,
  unreadCount,
  onIncrementUnreadCount,
  onDecrementUnreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  return (
    <div
      style={{
        minWidth: 320,
        padding: 12,
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        color: '#333',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 700 }}>
          Notifications
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, color: '#4b5563' }}>
            {unreadCount}
            {' '}
            unread
          </div>
          <Button
            buttonStyle="default"
            marginBottom0
            onClick={onDecrementUnreadCount}
          >
            -
          </Button>
          <Button
            buttonStyle="default"
            marginBottom0
            onClick={onIncrementUnreadCount}
          >
            +
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Button buttonStyle="primary" marginBottom0>
          All
        </Button>
        <Button buttonStyle="default" marginBottom0>
          Unread
        </Button>
        <Button buttonStyle="default" marginBottom0>
          Mentions
        </Button>
      </div>

      <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: 10,
              marginBottom: 8,
              backgroundColor: notification.unread ? '#f8fafc' : '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{notification.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{notification.time}</div>
            </div>
            <div style={{ fontSize: 12, color: '#374151', marginBottom: 8 }}>{notification.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: '#fff',
                  backgroundColor: getBadgeColor(notification.kind),
                  padding: '2px 6px',
                  borderRadius: 999,
                }}
              >
                {notification.kind}
              </span>
              {notification.unread ? (
                <Button
                  buttonStyle="dropdownItem"
                  marginBottom0
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <Button
          buttonStyle="default"
          marginBottom0
          onClick={onMarkAllAsRead}
        >
          Mark all as read
        </Button>
        <Button
          buttonStyle="primary"
          marginBottom0
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};