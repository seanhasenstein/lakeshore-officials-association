import React from 'react';
import { useRouter } from 'next/router';
import { formatToTitleCase, getUrlParam } from '../../utils/misc';
import FullLayout from '../../components/layouts/FullLayout';
import SportDirectory from '../../components/SportDirectory';

export default function SportPage() {
  const router = useRouter();
  const [sport, setSport] = React.useState<string>();

  React.useEffect(() => {
    if (router.isReady && router.query.sport) {
      const updatedSport = getUrlParam(router.query.sport);
      setSport(getUrlParam(updatedSport));
    }
  }, [router.isReady, router.query.sport]);

  return (
    <FullLayout
      title={sport ? formatToTitleCase(sport) : ''}
      authRequired={true}
    >
      {sport ? <SportDirectory sport={sport} /> : null}
    </FullLayout>
  );
}
