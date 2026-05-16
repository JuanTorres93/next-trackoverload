import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import Input from './Input';
import { useState } from 'react';

function PasswordInput({ ...props }: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input {...props} type={showPassword ? 'text' : 'password'}>
      <button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <HiEyeSlash /> : <HiEye />}
      </button>
    </Input>
  );
}

export default PasswordInput;
