import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IFormProps {
  name: string;
  price: number;
  description: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] =
    useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION);

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>();

  const onSubmit = () => {};

  return (
    <div className='container flex flex-col items-center mt-52'>
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <form
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className='input'
          {...register('name', { required: 'Name is required.' })}
          type='text'
          placeholder='Name'
        ></input>
        <input
          className='input'
          {...register('price', { required: 'Price is required.' })}
          type='number'
          placeholder='Price'
        ></input>
        <input
          className='input'
          {...register('description', { required: 'Description is required.' })}
          type='text'
          placeholder='Description'
        ></input>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Create Dish'
        ></Button>
      </form>
    </div>
  );
};
