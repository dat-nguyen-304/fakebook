'use client';

import Contacts from '@components/content/Contacts';
import NewsFeed from '@components/content/NewsFeed';
import Shortcut from '@components/content/Shortcut';
import { useMe } from '@hooks/api/auth';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const { data: user } = useMe();

  return (
    <div className="mt-[56px] grid grid-cols-4 p-[6px] min-h-[calc(100vh-56px)] bg-[#18191a]">
      {user && (
        <>
          <Shortcut />
          <NewsFeed />
          <Contacts />
        </>
      )}
    </div>
  );
};

export default App;
