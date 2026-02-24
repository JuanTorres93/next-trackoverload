import { cloneElement } from 'react';
import TextSmall from '../typography/TextSmall';

type WithId = { id?: string };

function FormEntry({
  labelText,
  htmlFor,
  setHorizontal = false,
  reverseLabelOrder = false,
  children,
  ...props
}: {
  labelText: string;
  htmlFor: string;
  setHorizontal?: boolean;
  reverseLabelOrder?: boolean;
  children: React.ReactElement;
} & React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  const childWitId = cloneElement(children as React.ReactElement<WithId>, {
    id: htmlFor,
  });

  return (
    <div
      className={`flex gap-2 ${
        setHorizontal ? 'flex-row items-center' : 'flex-col'
      } 
      ${reverseLabelOrder && !setHorizontal ? 'flex-col-reverse ' : ''} 
      ${reverseLabelOrder && setHorizontal ? 'flex-row-reverse mr-auto' : ''}
      ${className}`}
      {...rest}
    >
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
