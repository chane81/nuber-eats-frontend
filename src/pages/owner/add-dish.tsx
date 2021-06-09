import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
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
  [key: string]: string;
}

export const AddDish = () => {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

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

  const { register, getValues, formState, handleSubmit, setValue } =
    useForm<IFormProps>({
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

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((cur) => cur.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, '');
    setValue(`${idToDelete}-optionExtra`, '');
  };

  const onAddOptionClick = () => {
    setOptionsNumber((cur) => [Date.now(), ...cur]);
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
        <div className='my-10'>
          <h4 className='font-medium mb-3'>Dish Options</h4>
          <span
            className='cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5'
            onClick={onAddOptionClick}
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className='mt-5'>
                <input
                  type='text'
                  {...register(`${id}-optionName`)}
                  className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
                  placeholder='Option Name'
                ></input>
                <input
                  type='number'
                  min={0}
                  {...register(`${id}-optionExtra`)}
                  className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
                  placeholder='Option Extra'
                ></input>
                <span
                  className='cursor-pointer text-white bg-red-500 py-3 px-4'
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Create Dish'
        ></Button>
      </form>
    </div>
  );
};
