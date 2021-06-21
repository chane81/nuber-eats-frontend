import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  isSelected = false,
  orderStarted = false,
  options,
  addItemToOrder,
  removeFromOrder,
}) => {
  const handleClick = () => {
    if (orderStarted) {
      if (!isSelected) {
        addItemToOrder?.(id);
      }

      if (isSelected) {
        removeFromOrder?.(id);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-8 pt-3 pb-8 border cursor-pointer transition-all ${
        isSelected ? 'border-lime-600 border-b-4' : 'hover:border-gray-800 '
      }`}
    >
      <div className='mb-5'>
        <h3 className='text-lg font-medium'>{name}</h3>
        <h4 className='font-medium'>{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options.length > 0 && (
        <div>
          <h5 className='mt-8 mb-3 font-medium'>Dish Options</h5>
          {options?.map((option) => (
            <span key={option.name} className='flex items-center'>
              <h6 className='mr-2'>{option.name}</h6>
              <h6 className='text-sm opacity-75'>({option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
