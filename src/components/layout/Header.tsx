interface HeaderProps {
  shoeModel: string;
  price: number;
}

export const Header: React.FC<HeaderProps> = ({ shoeModel, price }) => {
  return (
    <header className="grid grid-cols-2 py-6 px-8 min-w-0 bg-black">
      <div className=" min-w-0 grid grid-cols-2">
        <h1 className="text-md font-light tracking-wide text-white whitespace-nowrap">
          KWONHYUNJIN©
        </h1>
        <span className="text-md font-thin text-gray-400 whitespace-nowrap -ml-4">
          2025
        </span>
      </div>

      <div className="flex flex-col items-end md:flex-row md:items-center md:gap-4 min-w-0">
        <span className="text-sm font-mono text-gray-500 truncate">
          {shoeModel}
        </span>
        <span className="text-sm font-mono text-gray-500 whitespace-nowrap">
          ${price.toFixed(2)}
        </span>
      </div>
    </header>
  );
};
