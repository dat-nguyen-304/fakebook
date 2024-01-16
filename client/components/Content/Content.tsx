'use client';

import Contacts from './Contacts';
import NewsFeed from './NewsFeed';
import Shortcut from './Shortcut';

interface ContentProps {}
const Content: React.FC<ContentProps> = () => {
    return (
        <div className="mt-[56px] grid grid-cols-4 p-[6px] min-h-[90vh] bg-[#18191a]">
            <Shortcut />
            <NewsFeed />
            <Contacts />
        </div>
    );
};

export default Content;
