interface IProps {
  coverImg?: string;
  name: string;
}

export const Category: React.FC<IProps> = ({ coverImg, name }) => {
  return (
    <div className='flex flex-col items-center cursor-pointer group'>
      <div
        className='w-14 h-14 bg-cover group-hover:bg-gray-200 rounded-full'
        style={{ backgroundImage: `url(${coverImg})` }}
      />
      <span className='mt-1 text-sm font-medium'>{name}</span>
    </div>
  );
};
