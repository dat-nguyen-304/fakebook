import NotificationItem from './NotificationItem';

interface NotificationListProps {
  isNotificationOpen: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ isNotificationOpen }) => {
  if (!isNotificationOpen) return null;
  return (
    <div className="fixed top-[57px] bottom-[50px] rounded-md shadow-md right-[20px] w-[360px] bg-[#242526] text-[#b0b3b8] px-[8px] pt-[16px] pb-[32px]">
      <div className="overflow-y-scroll h-full">
        <h3 className="text-[24px] font-bold text-[#e4e6eb] px-[6px]">Notifications</h3>
        <div className="mt-4 h-full">
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
