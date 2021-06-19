import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IProps {
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
}

export const Dish: React.FC<IProps> = ({
  description,
  name,
  price,
  isCustomer = false,
  options,
}) => {
  return (
    <div className='px-8 pt-3 pb-8 border hover:border-gray-500 transition-all'>
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
