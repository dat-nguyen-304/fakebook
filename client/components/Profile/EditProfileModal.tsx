import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import { useUpdateUser } from '@hooks/api/user';
import { useEffect, useState } from 'react';
import { Gender, User } from '@types';
import { useMe } from '@hooks/api/auth';

interface EditDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  handleToast: (action: 'loading' | 'dismiss' | 'error', message?: string) => void;
}
const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ user, isOpen, onClose, handleToast }) => {
  const [fullName, setFullName] = useState<string>(user.fullName);
  const [gender, setGender] = useState<Gender>(user.gender);
  const { refetch } = useMe();
  const { mutate: updateUser, isSuccess, error, isError, isPending } = useUpdateUser(user.id);

  useEffect(() => {
    if (isPending) handleToast('loading');
    if (isSuccess) refetch();
    if (isError) handleToast('error', error.message);
    handleToast('dismiss');
  }, [isPending, isSuccess, isError]);

  const updateProfile = () => {
    if (!fullName.trim().length) return handleToast('error', 'Full name is required');
    updateUser({ fullName: fullName.trim(), gender });
    onClose();
  };

  const footer = (
    <button onClick={updateProfile} className="w-full bg-[#243a52] hover:bg-[#3a4f64] text-[#75b6ff] rounded-lg py-2">
      Save changes
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} title="Edit Profile">
      <div className="w-full">
        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Full name</h4>
          <Input placeholder="Your full name" value={fullName} required onChange={e => setFullName(e.target.value)} />
        </div>
        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Gender</h4>
          <Select
            value={gender}
            options={[
              { label: 'Male', value: Gender.MALE },
              { label: 'Female', value: Gender.FEMALE }
            ]}
            onChange={e => {
              setGender(e.target.value as Gender);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailsModal;
