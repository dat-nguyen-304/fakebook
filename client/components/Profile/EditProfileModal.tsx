import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import { useMe } from '@hooks/api/auth';
import { useUpdateUser } from '@hooks/api/user';
import { useUser } from '@hooks/client';
import { useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { Gender } from '@types';

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ isOpen, onClose }) => {
  const { user, onChangeUser } = useUser();
  const [fullName, setFullName] = useState<string>(user?.fullName ?? '');
  const [gender, setGender] = useState<Gender>(user?.gender ?? Gender.MALE);
  const { data: me, refetch } = useMe();
  const { mutate: updateUser, isSuccess, error, isError, isPending } = useUpdateUser(String(user?.id));

  const toastIdRef = useRef<Id>();

  useEffect(() => {
    if (isPending) toastIdRef.current = toast.loading('Loading...');
    if (isSuccess) refetch();
    if (isError) toast.error(error.message);
    toast.dismiss(toastIdRef.current);
  }, [isPending, isSuccess, isError]);

  useEffect(() => {
    if (me) onChangeUser(me.data);
  }, [me]);

  const updateProfile = () => {
    if (!fullName.trim().length) return toast.error('Full name is required');
    updateUser({ fullName: fullName.trim(), gender });
    onClose();
  };

  if (!user) return null;

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
