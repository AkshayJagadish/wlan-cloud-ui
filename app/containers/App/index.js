import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect } from 'react-router-dom';

import { ThemeProvider, Dashboard } from '@tip-wlan/wlan-cloud-ui-library';

import logo from 'images/tip-logo.png';
import logoMobile from 'images/tip-logo-mobile.png';

import { AUTH_TOKEN, COMPANY } from 'constants/index';
import Login from 'containers/Login';
import ClientDevices from 'containers/ClientDevices';
import UserProvider from 'contexts/UserProvider';

import { getItem } from 'utils/localStorage';
import { parseJwt } from 'utils/jwt';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const RedirectToDashboard = () => (
  <Redirect
    to={{
      pathname: '/dashboard',
    }}
  />
);

const App = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = getItem(AUTH_TOKEN);
    if (token) {
      const { userId, userName, userRole, customerId } = parseJwt(token.access_token);

      setUser({ id: userId, email: userName, role: userRole, customerId });
    }
  }, []);

  const updateUser = newUser => setUser({ ...user, ...newUser });

  return (
    <UserProvider
      id={user.id}
      email={user.email}
      role={user.role}
      customerId={user.customerId}
      updateUser={updateUser}
    >
      <ThemeProvider company={COMPANY} logo={logo} logoMobile={logoMobile}>
        <Helmet titleTemplate={`%s - ${COMPANY}`} defaultTitle={COMPANY}>
          <meta name="description" content={COMPANY} />
        </Helmet>

        <Switch>
          <UnauthenticatedRoute exact path="/login" component={Login} />
          <ProtectedRouteWithLayout exact path="/" component={RedirectToDashboard} />
          <ProtectedRouteWithLayout exact path="/dashboard" component={Dashboard} />
          <ProtectedRouteWithLayout
            exact
            path="/network/client-devices"
            component={ClientDevices}
          />
        </Switch>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
