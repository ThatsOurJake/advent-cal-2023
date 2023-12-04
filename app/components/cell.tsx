import isValid from "@/app/utils/is-valid";

export interface CellProps {
  value: string;
  color: 'green' | 'orange' | 'blue' | 'red';
  hasBeenCompleted: boolean;
}

const Cell = ({ value, color, hasBeenCompleted }: CellProps) => {
  const bgColour = hasBeenCompleted ? `bg-${color}-50` : `bg-${color}-200`;

  return (
    <a href={isValid(parseInt(value, 10)) ? `/day/${value}` : ''}>
      <div className="aspect-square p-4 cursor-pointer hover:underline relative">
        <div className={`${bgColour} rounded-md p-2 w-full h-full flex justify-center items-center font-bold text-4xl`}>{value}</div>
        {
          hasBeenCompleted && (
            <div className="rounded-bl-md bg-lime-500 bottom-4 right-4 w-8 h-8 absolute triangle-clip" />
          )
        }
      </div>
  </a>
  )
};

export default Cell;
