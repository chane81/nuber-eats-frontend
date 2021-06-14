import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, useFieldArray } from 'react-hook-form';
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
  price: number;
  description: string;
  file: FileList;

  // react-hook-form 의 field array 방식
  // field array
  options: {
    name: string;
    extra: number;
  }[];

  // 기존방식
  //[key: string]: string | FileList | undefined;
}

export const AddDish = () => {
  const [uploading, setUploading] = useState(false);
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();

  // mutation
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

  // react-hook-form base
  const { register, getValues, control, formState, handleSubmit, setValue } =
    useForm<IFormProps>({
      mode: 'onChange',
    });

  // react-hook-form field array
  const { fields, append, remove, insert, prepend } = useFieldArray({
    name: 'options',
    control,
  });

  // submit
  const onSubmit = async (data: IFormProps) => {
    setUploading(true);

    const { name, price, description, file, options } = data;
    const actualFile = file[0];
    const formBody = new FormData();
    formBody.append('file', actualFile);

    // 이미지 upload
    const { url: photo } = await (
      await fetch('http://localhost:4000/uploads/', {
        method: 'POST',
        body: formBody,
      })
    ).json();

    // mutation call
    await createDishMutation({
      variables: {
        input: {
          name,
          price,
          description,
          restaurantId: +restaurantId,
          photo,
          options,
        },
      },
    });

    setUploading(false);

    history.goBack();
  };

  // 옵션 삭제
  const onDeleteOptionClick = (deleteId: number) => {
    remove(deleteId);
  };

  // 옵션 추가
  const onAddOptionClick = () => {
    prepend({
      name: '',
      extra: 0,
    });
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
          {...register('price', {
            required: 'Price is required.',
            valueAsNumber: true,
          })}
          type='number'
          placeholder='Price'
        ></input>
        <input
          className='input'
          {...register('description', { required: 'Description is required.' })}
          type='text'
          placeholder='Description'
        ></input>
        <input
          type='file'
          accept='image/*'
          {...register('file', {
            required: true,
          })}
        />
        <div className='my-10'>
          <h4 className='font-medium mb-3'>Dish Options</h4>
          <span
            className='cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5'
            onClick={onAddOptionClick}
          >
            Add Dish Option
          </span>
          {fields.length > 0 &&
            fields.map((field, idx) => (
              <div key={field.id} className='mt-5'>
                <input
                  type='text'
                  {...register(`options.${idx}.name` as const)}
                  className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
                  placeholder='Option Name'
                ></input>
                <input
                  type='number'
                  min={0}
                  {...register(`options.${idx}.extra` as const, {
                    valueAsNumber: true,
                  })}
                  className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
                  placeholder='Option Extra'
                ></input>
                <span
                  className='cursor-pointer text-white bg-red-500 py-3 px-4'
                  onClick={() => onDeleteOptionClick(idx)}
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
