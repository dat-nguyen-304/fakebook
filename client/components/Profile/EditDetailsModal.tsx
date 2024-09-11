import Modal from '@components/common/Modal';
import Input from '@components/common/Input';

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ isOpen, onClose }) => {
  const footer = (
    <button className="w-full bg-[#243a52] hover:bg-[#3a4f64] text-[#75b6ff] rounded-lg py-2">Save changes</button>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} title="Edit Details">
      <div className="w-full">
        <h3 className="text-[#b3b0b8] text-[15px]">This is the content of the modal. You can put any content here!</h3>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Current City</h4>
          <Input placeholder="Add current city" />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Hometown</h4>
          <Input placeholder="Add hometown" />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Work</h4>
          <Input placeholder="Add a workplace" />
        </div>

        <div className="my-[28px]">
          <h4 className="text-[17px] text-[#dfe2e5] mb-2 font-bold">Education</h4>
          <Input placeholder="Add school" />
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailsModal;
