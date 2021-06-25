import { gql, useApolloClient, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { REGEX_EMAIL } from '../../constants';
import { useMe } from '../../hooks/useMe';
import {
  editProfile,
  editProfileVariables,
} from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { error, ok },
    } = data;

    if (ok && userData) {
      // prev email
      const {
        me: { email: prevEmail, id },
      } = userData;

      // new email
      const { email: newEmail } = getValues();

      // update cache
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = async () => {
    const { email, password } = getValues();

    await editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
  };

  return (
    <div className='mt-52 flex flex-col justify-center items-center'>
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className='font-semibold text-2xl mb-3'>Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
      >
        <input
          {...register('email', {
            pattern: REGEX_EMAIL,
          })}
          className='input'
          type='email'
          placeholder='Email'
        />
        <input
          {...register('password')}
          className='input'
          type='password'
          placeholder='Password'
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Save Profile'
        />
      </form>
    </div>
  );
};
