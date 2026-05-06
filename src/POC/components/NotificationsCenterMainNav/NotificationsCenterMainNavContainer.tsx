import React from 'react';

import {
  Popper,
} from '@folio/stripes/components';

import {
  NotificationItem,
  NotificationsCenterMainNav,
} from './NotificationsCenterMainNav';

const POC_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Invoice requires approval',
    description: 'Invoice INV-10342 from EBS Vendor Group is waiting for your review.',
    time: '2 min ago',
    unread: true,
    kind: 'action',
  },
  {
    id: 'n2',
    title: 'Export finished',
    description: 'Holdings export completed successfully. 1283 records were generated.',
    time: '18 min ago',
    unread: true,
    kind: 'system',
  },
  {
    id: 'n3',
    title: 'Scheduled job warning',
    description: 'Nightly sync skipped 4 records due to invalid identifiers.',
    time: '1 h ago',
    unread: false,
    kind: 'warning',
  },
  {
    id: 'n4',
    title: 'Permission changed',
    description: 'Your role was updated by administrator "ops-admin".',
    time: 'Yesterday',
    unread: false,
    kind: 'security',
  },
];

interface Props {
  renderTrigger?: (extraProps?: Record<string, unknown>) => React.ReactNode;
  triggerProps?: Record<string, unknown>;
}

export const NotificationsCenterMainNavContainer: React.FC<Props> = ({
  renderTrigger,
  triggerProps = {},
}) => {
  const fallbackTriggerRef = React.useRef<HTMLElement | null>(null);
  const triggerRef = (triggerProps.ref as React.RefObject<HTMLElement>) || fallbackTriggerRef;
  const triggerOnClick = triggerProps.onClick as ((event: React.MouseEvent) => void) | undefined;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(document.getElementById('OverlayContainer') as HTMLDivElement);
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(POC_NOTIFICATIONS);

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  const unreadCount = React.useMemo(() => {
    return notifications.filter((item) => item.unread).length;
  }, [notifications]);

  const incrementUnreadCount = () => {
    setNotifications((prev) => ([
      {
        id: `poc-${Date.now()}`,
        title: 'New POC notification',
        description: 'This notification was generated with + button for demo purposes.',
        time: 'just now',
        unread: true,
        kind: 'system',
      },
      ...prev,
    ]));
  };

  const decrementUnreadCount = () => {
    setNotifications((prev) => {
      const firstUnreadIndex = prev.findIndex((item) => item.unread);

      if (firstUnreadIndex === -1) {
        return prev;
      }

      return prev.map((item, index) => {
        if (index !== firstUnreadIndex) {
          return item;
        }

        return {
          ...item,
          unread: false,
        };
      });
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => {
      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        unread: false,
      };
    }));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({
      ...item,
      unread: false,
    })));
  };

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close, triggerRef]);

  const renderMainNavTrigger = () => {
    if (!renderTrigger) {
      return null;
    }

    return renderTrigger({
      onClick: (event: React.MouseEvent) => {
        triggerOnClick?.(event);
        setOpen((prev) => !prev);
      },
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeSize: 'small',
    });
  };

  const anchorRef = { current: triggerRef.current };

  return (
    <>
      {renderMainNavTrigger()}
      <Popper
        isOpen={open}
        anchorRef={anchorRef}
        overlayRef={overlayRef}
        placement="bottom-end"
      >
        <div ref={contentRef}>
          <NotificationsCenterMainNav
            notifications={notifications}
            unreadCount={unreadCount}
            onIncrementUnreadCount={incrementUnreadCount}
            onDecrementUnreadCount={decrementUnreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClose={close}
          />
        </div>
      </Popper>
    </>
  );
};