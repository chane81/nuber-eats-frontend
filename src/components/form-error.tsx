interface IProps {
  errorMessage: string;
}

export const FormError: React.FC<IProps> = ({ errorMessage }) => {
  return <span className='font-medium text-red-500'>{errorMessage}</span>;
};
