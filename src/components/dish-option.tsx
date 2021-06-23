import React from 'react';

interface IProps {
  dishId: number;
  isSelected: boolean;
  name: string;
  extra?: number | null;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IProps> = ({
  dishId,
  isSelected,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const handleClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`flex items-center border ${isSelected ? 'border-gray-800' : ''}`}
    >
      <h6 className='mr-2'>{name}</h6>
      {extra && <h6 className='text-sm opacity-75'>({extra})</h6>}
    </span>
  );
};
