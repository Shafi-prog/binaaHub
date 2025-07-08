// @ts-nocheck
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  currency?: string;
  image?: string;
  storeName: string;
  storeSlug: string;
}

export default function ProductCard({
  id,
  title,
  price,
  currency = 'SAR',
  image,
  storeName,
  storeSlug,
}: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 rounded mb-3 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">
        by <a href={`/stores/${storeSlug}`} className="text-blue-600 hover:underline">
          {storeName}
        </a>
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          {currency} {price}
        </span>
        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          View
        </button>
      </div>
    </div>
  );
}


