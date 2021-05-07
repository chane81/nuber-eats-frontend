import React from 'react';
import { useForm } from 'react-hook-form';

interface ILoginForm {
  email?: string;
  password?: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginForm>();

  const onSubmit = () => {
    console.log('submit');
    console.log(getValues(), errors);
  };

  const onInvalid = () => {
    console.log('errors', errors);
    console.log('cant create account');
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-800'>
      <div className='bg-gray-200 w-full max-w-lg pt-10 pb-7 rounded-lg text-center'>
        <h3 className='text-2xl text-gray-800 font-mono'>Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className='grid gap-3 mt-5 px-5'
        >
          <input
            {...register('email', {
              required: 'Email is required'
            })}
            name='email'
            type='email'
            placeholder='Email'
            className='input mb-3'
          />
          {errors.email?.message && (
            <span className='font-medium text-red-500'>
              {errors.email?.message}
            </span>
          )}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 10
            })}
            name='password'
            type='password'
            placeholder='Password'
            className='input'
          />
          {errors.password?.message && (
            <span className='font-medium text-red-500'>
              {errors.password?.message}
            </span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className='font-medium text-red-500'>
              Password must be more than 10 chars.
            </span>
          )}
          <button className='button mt-3'>Log In</button>
        </form>
      </div>
    </div>
  );
};