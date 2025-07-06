interface StoreCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  productsCount?: number;
  rating?: number;
  verified?: boolean;
}

export default function StoreCard({
  id,
  name,
  slug,
  description,
  logo,
  productsCount = 0,
  rating = 0,
  verified = false,
}: StoreCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full overflow-hidden mr-4">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{name}</h3>
            {verified && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Verified
              </span>
            )}
          </div>
          
          {rating > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">({rating})</span>
            </div>
          )}
        </div>
      </div>
      
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {productsCount} products
        </span>
        <a
          href={`/stores/${slug}`}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Visit Store
        </a>
      </div>
    </div>
  );
}
