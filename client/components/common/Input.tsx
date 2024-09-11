interface InputProps {
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="text-sm w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out text-[#d8dbdf] bg-transparent"
    />
  );
};

export default Input;
