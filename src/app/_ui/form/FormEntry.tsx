import { cloneElement } from 'react';
import TextSmall from '../typography/TextSmall';

type WithId = { id?: string };

function FormEntry({
  labelText,
  htmlFor,
  children,
}: {
  labelText: string;
  htmlFor: string;
  children: React.ReactElement;
}) {
  const childWitId = cloneElement(children as React.ReactElement<WithId>, {
    id: htmlFor,
  });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor}>
        <TextSmall className="font-input font-medium text-label leading-5.25">
          {labelText}
        </TextSmall>
      </label>
      {childWitId}
    </div>
  );
}

export default FormEntry;
