import React from 'react';
import { useParams } from 'react-router-dom';
import OtherUserProfile from './OtherUserprofile';

const OtherUserProfileWrapper = () => {
  const { userId } = useParams();
  return <OtherUserProfile user_id={userId} />;
};

export default OtherUserProfileWrapper;
