import { RotateLoading } from 'respinner';

function Spinner({ ...props }: React.ComponentProps<typeof RotateLoading>) {
  return <RotateLoading color="#a1a1a1" duration={1} {...props} />;
}

export default Spinner;
