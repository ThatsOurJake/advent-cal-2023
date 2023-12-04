import isValid from "@/app/utils/is-valid";

interface CellProps {
  value: string;
  color: 'green' | 'orange' | 'blue' | 'red';
}

const Cell = ({ value, color }: CellProps) => {
  return (
    <a href={isValid(parseInt(value, 10)) ? `/day/${value}` : ''}>
      <div className="aspect-square p-4 cursor-pointer hover:underline">
        <div className={`bg-${color}-200 rounded-md p-2 w-full h-full flex justify-center items-center font-bold text-4xl`}>{value}</div>
      </div>
  </a>
  )
};

export default Cell;
