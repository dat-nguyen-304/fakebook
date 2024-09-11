import Modal from '@components/common/Modal';
import Textarea from '@components/common/TextArea';
import ToggleButton from '@components/common/ToggleButton';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';
import { GoUpload } from 'react-icons/go';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps }: DropzoneRootProps = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleClose = () => {
    onClose();
    setUploadedFiles([]);
  };

  const footer = (
    <>
      <button onClick={handleClose} className="w-full bg-[#3b3d3e] text-[#dde0e4] hover:bg-[#505153] rounded-lg py-2">
        Discard
      </button>

      {uploadedFiles.length ? (
        <button className="w-full mt-4 bg-[#243a52] hover:bg-[#3a4f64] text-[#75b6ff] rounded-lg py-2">
          Save changes
        </button>
      ) : null}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} footer={footer} title="Choose profile cover">
      <div className="my-4">
        <h4 className="text-[17px] text-[#dfe2e5] font-bold">Profile cover</h4>
        <div className="flex justify-center">
          <div {...getRootProps()} className="group my-4 relative w-full h-[240px] rounded-md">
            <input {...getInputProps()} name="avatar" />
            <Image
              className="w-full h-full rounded-md object-cover"
              src={uploadedFiles.length ? URL.createObjectURL(uploadedFiles[0]) : '/avatar.jpg'}
              alt=""
              width={240}
              height={240}
            />
            <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center rounded-md bg-[rgba(0,0,0,0.4)]">
              <GoUpload size={40} />
              <span className="text-sm">Upload new profile picture</span>
            </div>
          </div>
        </div>
      </div>

      {uploadedFiles.length ? (
        <div className="my-4 flex items-center gap-4">
          <h4 className="text-[17px] text-[#dfe2e5] font-bold">Public</h4>
          <ToggleButton enabled={isPublic} onToggle={() => setIsPublic(!isPublic)} />
        </div>
      ) : null}

      {isPublic && uploadedFiles.length ? (
        <div className="my-4">
          <h4 className="text-[17px] text-[#dfe2e5] font-bold mb-4">Description</h4>
          <Textarea value={description} onChange={setDescription} />
        </div>
      ) : null}
    </Modal>
  );
};

export default EditProfileModal;
