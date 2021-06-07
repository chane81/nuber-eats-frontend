import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  catregoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const { errors } = formState;
  const onSubmit = () => {
    console.log('values', getValues());
  };

  return (
    <div className='container'>
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className='input'
          type='text'
          placeholder='name'
          {...register('name', {
            required: 'Name is required.',
          })}
        ></input>
        <input
          className='input'
          type='text'
          placeholder='address'
          {...register('address', {
            required: 'address is required.',
          })}
        ></input>
        <input
          className='input'
          type='text'
          placeholder='catregoryName'
          {...register('catregoryName', {
            required: 'catregoryName is required.',
          })}
        ></input>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Create Restaurant'
        ></Button>
      </form>
    </div>
  );
};
