import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import { AppLayout as Layout } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';

import { removeItem } from 'utils/localStorage';

import UserContext from 'contexts/UserContext';

const MasterLayout = ({ children }) => {
  const { role } = useContext(UserContext);

  const client = useApolloClient();
  const location = useLocation();

  const handleLogout = () => {
    removeItem(AUTH_TOKEN);
    client.resetStore();
  };

  const menuItems = [
    {
      key: 'dashboard',
      path: '/dashboard',
      text: 'Dashboard',
    },
    {
      key: 'network',
      path: '/network',
      text: 'Network',
    },
    {
      key: 'profiles',
      path: '/profiles',
      text: 'Profiles',
    },
    {
      key: 'alarms',
      path: '/alarms',
      text: 'Alarms',
    },
    {
      key: 'system',
      path: '/System',
      text: 'System',
    },
  ];

  const mobileMenuItems = [
    {
      key: 'dashboard',
      path: '/dashboard',
      text: 'Dashboard',
    },
    {
      key: 'network',
      path: '/network',
      text: 'Network',
    },
    {
      key: 'profiles',
      path: '/profiles',
      text: 'Profiles',
    },
    {
      key: 'alarms',
      path: '/alarms',
      text: 'Alarms',
    },
    {
      key: 'system',
      path: '/System',
      text: 'System',
    },
    {
      key: 'settings',
      text: 'Settings',
      children: [
        {
          key: 'editAccount',
          path: '/account/edit',
          text: 'Edit Account',
        },
        {
          key: 'logout',
          path: '/',
          text: 'Log Out',
        },
      ],
    },
  ];

  if (role === 'SuperUser') {
    menuItems.push({
      key: 'accounts',
      path: '/accounts',
      text: 'Accounts',
    });
    mobileMenuItems.push({
      key: 'accounts',
      path: '/accounts',
      text: 'Accounts',
    });
  }

  return (
    <Layout
      onLogout={handleLogout}
      locationState={location}
      menuItems={menuItems}
      mobileMenuItems={mobileMenuItems}
    >
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
