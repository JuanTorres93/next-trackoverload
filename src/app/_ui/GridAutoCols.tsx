function GridAutoCols({
  children,
  min,
  max,
  fitOrFill = 'fit',
  ...props
}: {
  children: React.ReactNode;
  min: string;
  max: string;
  fitOrFill?: 'fit' | 'fill';
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, style, ...rest } = props;

  return (
    <div
      {...rest}
      // DOC: tailwind cannot create dynamic class names, so we need to use inline styles for the grid template columns
      style={{
        gridTemplateColumns: `repeat(auto-${fitOrFill}, minmax(${min}, ${max}))`,
        ...style,
      }}
      className={`grid ${className}`}
    >
      {children}
    </div>
  );
}

export default GridAutoCols;
