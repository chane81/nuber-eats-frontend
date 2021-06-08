import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';
import { myRestaurants } from '../../__generated__/myRestaurants';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;

    if (ok) {
      setUploading(false);

      const { name, categoryName, address } = getValues();

      // read cache
      const queryResult = client.readQuery<myRestaurants>({
        query: MY_RESTAURANTS_QUERY,
      });

      // write cache
      client.writeQuery<myRestaurants>({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myRestaurants,
            restaurants: [
              {
                name,
                id: restaurantId || 0,
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                },
                coverImg: imageUrl,
                isPromoted: false,
                __typename: 'Restaurant',
              },
            ],
            ok: true,
            error: '',
            __typename: 'MyRestaurantsOutput',
          },
        },
      });

      // home redirect
      history.push('/');
    }
  };

  // mutation
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const { errors } = formState;

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);

      // 파일 업로드
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();

      // 업로드 후 이미지 url set
      setImageUrl(coverImg);

      // gql mutation
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };

  return (
    <div className='container flex flex-col items-center mt-52'>
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className='font-semibold text-2xl mb-3'>Add Restaurant</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
      >
        <input
          className='input'
          type='text'
          placeholder='name'
          {...register('name', {
            required: 'Name is required.',
          })}
        />
        <input
          className='input'
          type='text'
          placeholder='address'
          {...register('address', {
            required: 'address is required.',
          })}
        />
        <input
          className='input'
          type='text'
          placeholder='categoryName'
          {...register('categoryName', {
            required: 'categoryName is required.',
          })}
        />
        <div>
          <input
            type='file'
            accept='image/*'
            {...register('file', {
              required: true,
            })}
          />
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Create Restaurant'
        ></Button>
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
