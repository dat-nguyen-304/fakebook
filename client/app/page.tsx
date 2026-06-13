'use client';

import Contacts from '@components/content/Contacts';
import NewsFeed from '@components/content/NewsFeed';
import Shortcut from '@components/content/Shortcut';
import { useMe } from '@hooks/api/user';

interface AppProps { }

const App: React.FC<AppProps> = () => {
  const { data: user } = useMe();

  return (
    <div className="mt-[56px] min-h-[calc(100vh-56px)] bg-[#18191a]">
      {user && (
        // Full-width row: rails hug the screen edges, feed centered between them.
        <div className="flex">
          <Shortcut />
          <NewsFeed />
          <Contacts />
        </div>
      )}
    </div>
  );
};

export default App;
