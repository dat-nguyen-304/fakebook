import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import Select from '@components/common/Select';

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ isOpen, onClose }) => {
  const footer = (
    <button className="w-full bg-[#243a52] hover:bg-[#3a4f64] text-[#75b6ff] rounded-lg py-2">Save changes</button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} title="Edit Profile">
      <div className="w-full">
        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Full name</h4>
          <Input placeholder="Your full name" />
        </div>
        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Gender</h4>
          <Select
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' }
            ]}
            onChange={() => {}}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailsModal;
