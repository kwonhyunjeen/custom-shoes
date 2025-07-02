interface HeaderProps {
  shoeModel: string;
  price: number;
}

export const Header: React.FC<HeaderProps> = ({ shoeModel, price }) => {
  return (
    <header className="grid grid-cols-2 md:grid-cols-3 py-6 px-8 border-b border-gray-200 min-w-0">
      {/* 브랜딩 & 연도 */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-30 min-w-0">
        <h1 className="text-md font-light tracking-wide text-gray-900 whitespace-nowrap">
          KWONHYUNJIN©
        </h1>
        <span className="text-md font-thin text-gray-400 whitespace-nowrap">
          2025
        </span>
      </div>

      {/* 빈 공간 (3D 영역과 맞춤) - 데스크톱에서만 */}
      <div className="hidden md:block"></div>

      {/* 모델명 & 가격 */}
      <div className="flex flex-col items-end md:flex-row md:items-center md:gap-4 md:ml-11 min-w-0">
        <span className="text-sm font-mono text-gray-600 truncate">
          {shoeModel}
        </span>
        <span className="text-sm font-mono text-gray-900 whitespace-nowrap">
          ${price.toFixed(2)}
        </span>
      </div>
    </header>
  );
};
