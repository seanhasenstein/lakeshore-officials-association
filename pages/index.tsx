import React from 'react';
import { useRouter } from 'next/router';
import FullLayout from '../components/layouts/FullLayout';
import UserProfile from '../components/UserProfile';
import SuccessNotification from '../components/common/SuccessNotification';

export default function Homepage() {
  const router = useRouter();
  const [showDeleteAccountNotification, setShowDeleteAccountNotification] =
    React.useState(false);

  React.useEffect(() => {
    if (router.query.deleteAccountNotification === 'true') {
      setShowDeleteAccountNotification(true);
    }
  }, [router.query.deleteAccountNotification]);

  return (
    <FullLayout title="Your profile" authRequired={true}>
      <UserProfile />
      <SuccessNotification
        show={showDeleteAccountNotification}
        setShow={setShowDeleteAccountNotification}
        title="Successfully Deleted"
        message={`${router.query.name}'s account has been deleted.`}
      />
    </FullLayout>
  );
}
