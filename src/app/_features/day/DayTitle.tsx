function DayTitle({
  dayName,
  isToday,
  ...props
}: {
  dayName: string;
  isToday: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props;
  return (
    <h2
      className={`text-lg text-text-light ${isToday ? 'font-semibold' : ''} ${className ?? ''}`}
      {...rest}
    >
      {dayName}
    </h2>
  );
}

export default DayTitle;
