import { Link } from 'react-router-dom';

interface IProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className='flex flex-col'>
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className='py-28 bg-cover bg-center mb-3'
        />
        <h3 className='text-xl'>{name}</h3>
        <span className='border-t mt-1 py-2 text-xs opacity-50 border-gray-400'>
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
