const ShimmerEffect: React.FC = () => {
  return (
    <div className="grid gap-4 p-4 overflow-auto max-w-full max-h-[700px] m-8 border border-gray-200 rounded-lg shadow-md">
      {Array.from({ length: 12 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 animate-pulse">
          <div className="h-20 bg-gray-200 rounded-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerEffect;
