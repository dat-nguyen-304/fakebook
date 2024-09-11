import { IoHomeSharp } from 'react-icons/io5';
import { TiWiFi } from 'react-icons/ti';
import { IoMdSchool } from 'react-icons/io';
import { MdLocationOn, MdWork } from 'react-icons/md';
import { useState } from 'react';
import Textarea from '@components/common/TextArea';
import cn from 'classnames';
import EditDetailsModal from './EditDetailsModal';

interface BiographyProps {}
const Biography: React.FC<BiographyProps> = () => {
  const [isOpenEditDetails, setIsOpenEditDetails] = useState<boolean>(false);
  const [bio, setBio] = useState<string>('');
  const [openBio, setOpenBio] = useState<boolean>(false);

  return (
    <>
      <div className="text-[#e4e6eb] w-2/5">
        <div className="bg-[#242526] py-[20px] px-[16px] rounded-md">
          <h3 className="text-[20px] font-bold">Intro</h3>
          <div className="w-full">
            <div className="text-[15px] my-[16px] pb-2 shadow-border-b">
              <div className={cn(openBio ? 'hidden' : 'w-full')}>
                <p className="text-center">I love you</p>
                <button
                  onClick={() => setOpenBio(true)}
                  className="w-full mt-2 bg-[#3b3d3e] hover:bg-[#505153] py-2 rounded-md font-bold"
                >
                  Edit bio
                </button>
              </div>
              {openBio && (
                <div>
                  <Textarea value={bio} onChange={setBio} autoFocus={true} placeholder="Describe who you are" />
                  <div className="flex justify-end gap-1 mt-1">
                    <button
                      onClick={() => {
                        setOpenBio(false);
                        setBio('');
                      }}
                      className="py-2 px-4 text-[15px] bg-[#3b3d3e] text-[#dde0e4] rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      className={cn(
                        'py-2 px-4 text-[15px]  rounded-xl font-semibold',
                        bio.trim().length ? 'bg-[#0866ff] text-[#f6faff]' : 'bg-[#3b3d3e] text-[#757778]'
                      )}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-[15px] flex items-center gap-2 my-[16px]">
                <TiWiFi color="#8c939d" size={20} />
                <span className="text-[#e2e5e9]">Followed by 99 people</span>
              </p>
              <p className="text-[15px] flex items-center gap-2 my-[16px]">
                <IoHomeSharp color="#8c939d" size={20} />
                <span className="text-[#e2e5e9]">Lives in America</span>
              </p>
              <p className="text-[15px] flex items-center gap-2 my-[16px]">
                <MdLocationOn color="#8c939d" size={20} />
                <span className="text-[#e2e5e9]">From VietNam</span>
              </p>
              <p className="text-[15px] flex items-center gap-2 my-[16px]">
                <MdWork color="#8c939d" size={20} />
                <span className="text-[#e2e5e9]">Worked at Google</span>
              </p>
              <p className="text-[15px] flex items-center gap-2 my-[16px]">
                <IoMdSchool color="#8c939d" size={20} />
                <span className="text-[#e2e5e9]">Studied at Harvard</span>
              </p>
              <button
                onClick={() => setIsOpenEditDetails(!isOpenEditDetails)}
                className="w-full bg-[#3b3d3e] hover:bg-[#505153] py-2 rounded-md font-bold"
              >
                Edit details
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditDetailsModal isOpen={isOpenEditDetails} onClose={() => setIsOpenEditDetails(false)} />
    </>
  );
};

export default Biography;
