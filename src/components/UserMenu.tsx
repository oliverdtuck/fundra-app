import type { FC } from 'react';

import { Avatar } from '@base-ui-components/react/avatar';
import { Menu } from '@base-ui-components/react/menu';
import { Link } from '@tanstack/react-router';
import { LogOut, Settings } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useMeSuspenseQuery } from '../hooks/useMeSuspenseQuery';

export const UserMenu: FC = () => {
  const meSuspenseQuery = useMeSuspenseQuery();
  const auth = useAuth();

  const signOut = () => {
    void auth.signOut();
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <button type="button">
            <Avatar.Root className="flex size-8 items-center justify-center rounded-full bg-black font-medium text-white">
              {meSuspenseQuery.data.name.charAt(0)}
            </Avatar.Root>
          </button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup className="w-64 rounded-lg border border-gray-300 bg-white p-[0.4375rem] shadow-sm">
            <Menu.Item
              className="flex items-center justify-between p-2 data-[highlighted]:rounded-lg data-[highlighted]:bg-gray-100"
              render={<Link to="/settings" />}
            >
              <span>Settings</span>
              <Settings className="text-gray-500" size={16} />
            </Menu.Item>
            <Menu.Item
              className="flex items-center justify-between p-2 data-[highlighted]:rounded-lg data-[highlighted]:bg-gray-100"
              onClick={signOut}
            >
              <span>Log Out</span>
              <LogOut className="text-gray-500" size={16} />
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
