import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import { useEffect, useRef, useState } from 'react';
import { IUpdateUserPayload } from '@types';
import { useUpdateUser } from '@hooks/api/user';
import { useUser } from '@hooks/client';
import { useMe } from '@hooks/api/auth';
import { Id, toast } from 'react-toastify';

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ isOpen, onClose }) => {
  const { user, onChangeUser } = useUser();
  const [living, setLiving] = useState<string>(user?.living ?? '');
  const [hometown, setHometown] = useState<string>(user?.hometown ?? '');
  const [work, setWork] = useState<string>(user?.work ?? '');
  const [school, setSchool] = useState<string>(user?.school ?? '');
  const { data: me, refetch } = useMe();
  const { mutate: updateUser, isSuccess, error, isError, isPending } = useUpdateUser(String(user?.id));
  const toastIdRef = useRef<Id>();

  useEffect(() => {
    if (isPending) toastIdRef.current = toast.loading('Loading...');
    if (isSuccess) {
      refetch();
      onClose();
    }
    if (isError) toast.error(error.message);
    toast.dismiss(toastIdRef.current);
  }, [isPending, isSuccess, isError]);

  useEffect(() => {
    if (me) onChangeUser(me.data);
  }, [me]);

  const handleSaveChanges = async () => {
    const updatedDetails: IUpdateUserPayload = {
      living: living.trim(),
      hometown: hometown.trim(),
      work: work.trim(),
      school: school.trim()
    };
    updateUser(updatedDetails);
    onClose();
  };

  const footer = (
    <button
      onClick={handleSaveChanges}
      className="w-full bg-[#243a52] hover:bg-[#3a4f64] text-[#75b6ff] rounded-lg py-2"
    >
      Save changes
    </button>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} title="Edit Details">
      <div className="w-full">
        <h3 className="text-[#b3b0b8] text-[15px]">This is the content of the modal. You can put any content here!</h3>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Current City</h4>
          <Input placeholder="Add current city" value={living} onChange={e => setLiving(e.target.value)} />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Hometown</h4>
          <Input placeholder="Add hometown" value={hometown} onChange={e => setHometown(e.target.value)} />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Work</h4>
          <Input placeholder="Add a workplace" value={work} onChange={e => setWork(e.target.value)} />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Education</h4>
          <Input placeholder="Add school" value={school} onChange={e => setSchool(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailsModal;
