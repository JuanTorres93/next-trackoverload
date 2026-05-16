import Image from 'next/image';

function AlertTriangle({ sizeInPx = 24 }: { sizeInPx?: number }) {
  return (
    <div>
      <Image
        src="/alert-triangle.svg"
        alt="Alert Triangle Icon"
        width={sizeInPx}
        height={sizeInPx}
      />
    </div>
  );
}

export default AlertTriangle;
