import React, { useContext } from 'react';
import { AddProfile as AddProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { notification } from 'antd';
import { useHistory } from 'react-router-dom';

import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES } from 'graphql/queries';

const CREATE_PROFILE = gql`
  mutation CreateProfile(
    $profileType: String!
    $customerId: ID!
    $name: String!
    $childProfileIds: [ID]
    $details: JSONObject
  ) {
    createProfile(
      profileType: $profileType
      customerId: $customerId
      name: $name
      childProfileIds: $childProfileIds
      details: $details
    ) {
      profileType
      customerId
      name
      childProfileIds
      details
    }
  }
`;

const AddProfile = () => {
  const { customerId } = useContext(UserContext);
  const { data: ssidProfiles } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'ssid', limit: 100 },
  });
  const [createProfile] = useMutation(CREATE_PROFILE);
  const history = useHistory();

  const handleAddProfile = (profileType, name, details, childProfileIds = []) => {
    createProfile({
      variables: {
        profileType,
        customerId,
        name,
        childProfileIds,
        details,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully created.',
        });
        history.push('/profiles', { refetch: true });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be created.',
        })
      );
  };

  return (
    <AddProfilePage
      onCreateProfile={handleAddProfile}
      ssidProfiles={
        (ssidProfiles && ssidProfiles.getAllProfiles && ssidProfiles.getAllProfiles.items) || []
      }
    />
  );
};

export default AddProfile;
