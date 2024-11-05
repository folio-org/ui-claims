import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AppContextMenu } from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';
import {
  AcqKeyboardShortcutsModal,
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { CLAIMING_ROUTE } from './constants';
import { RootRoutes } from './RootRoutes';

import './typing';

const Root: React.FC = () => {
  const [isOpen, toggleModal] = useModalToggle();

  const focusSearchField = (): void => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: handleKeyCommand(focusSearchField),
    },
    {
      name: 'openShortcutModal',
      shortcut: 'mod+alt+k',
      handler: handleKeyCommand(toggleModal),
    },
  ];

  return (
    <>
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(handleToggle: () => void) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="claiming-app-search-item"
                    to={{
                      pathname: CLAIMING_ROUTE,
                      state: { resetFilters: true },
                    }}
                    onClick={() => {
                      handleToggle();
                      focusSearchField();
                    }}
                  >
                    <FormattedMessage id="ui-claims.appMenu.claimingAppSearch" />
                  </NavListItem>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => {
                      handleToggle();
                      toggleModal();
                    }}
                  >
                    <FormattedMessage id="stripes-acq-components.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>

          <RootRoutes />
        </HasCommand>
      </CommandList>

      {isOpen && (
        <AcqKeyboardShortcutsModal onClose={toggleModal} />
      )}
    </>
  );
};

export default Root;
