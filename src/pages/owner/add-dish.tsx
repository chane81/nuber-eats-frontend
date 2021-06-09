import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });

    history.goBack();
  };

  return (
    <div className='container flex flex-col items-center mt-52'>
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className='font-semibold text-exl mb-3'>Add Dish</h4>
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
          min={0}
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
