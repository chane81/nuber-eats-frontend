import { useMutation, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';
import nuberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN, REGEX_EMAIL } from '../constants';

export const LOGIN_MUTATION = gql`
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

export const Login = () => {
  const { register, getValues, handleSubmit, formState } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const onCompleted = (data: loginMutation) => {
    const { ok, token } = data.login;

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { loading, data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const { errors } = formState;

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
    // console.info('errors', errors);
    // console.info('cant create account');
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img src={nuberLogo} className='w-52 mb-10' alt='logo' />
        <h4 className='w-full font-medium text-left text-3xl mb-5'>
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className='grid gap-3 mt-5 w-full mb-3'
        >
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: REGEX_EMAIL,
            })}
            name='email'
            type='email'
            placeholder='Email'
            className='input'
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage='Please enter a valid email' />
          )}
          <input
            {...register('password', {
              required: 'Password is required',
            })}
            name='password'
            type='password'
            placeholder='Password'
            className='input'
            autoComplete='off'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText='Login In'
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{' '}
          <Link to='/create-account' className='text-lime-600 hover:underline'>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
