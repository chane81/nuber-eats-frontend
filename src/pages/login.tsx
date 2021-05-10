import { useMutation, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import React from 'react';
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

const onCompleted = (data: loginMutation) => {
  const {
    login: { ok, token },
  } = data;

  if (ok) {
    console.log('token', token);
  }
};

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const [loginMutation, { loading, error, data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();

      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  const onInvalid = () => {
    console.log('errors', errors);
    console.log('cant create account');
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-800'>
      <div className='bg-gray-200 w-full max-w-lg pt-10 pb-7 rounded-lg text-center'>
        <h3 className='text-2xl text-gray-800 font-mono'>Log In</h3>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='grid gap-3 mt-5 px-5'>
          <input
            {...register('email', {
              required: 'Email is required',
            })}
            name='email'
            type='email'
            placeholder='Email'
            className='input mb-3'
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          <input
            {...register('password', {
              required: 'Password is required',
            })}
            name='password'
            type='password'
            placeholder='Password'
            className='input'
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === 'minLength' && <FormError errorMessage='Password must be more than 10 chars.' />}
          <button className='button mt-3'>{loading ? 'Loading...' : 'Log In'}</button>
          {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
        </form>
      </div>
    </div>
  );
};
