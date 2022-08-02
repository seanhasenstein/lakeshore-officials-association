import FullLayout from '../components/layouts/FullLayout';
import UserProfile from '../components/UserProfile';

export default function Homepage() {
  return (
    <FullLayout title="Your profile" authRequired={true}>
      <UserProfile />
    </FullLayout>
  );
}
