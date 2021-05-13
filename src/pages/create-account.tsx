import { useMutation, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Helmet from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { FormError } from '../components/form-error';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';
import nuberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { UserRole } from '../__generated__/globalTypes';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const { register, getValues, watch, handleSubmit, formState } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const { error, ok } = data.createAccount;

    if (ok) {
      // redirect login page
      history.push('/login');
    }
  };

  const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const { errors } = formState;

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img src={nuberLogo} className='w-52 mb-10' alt='logo' />
        <h4 className='w-full font-medium text-left text-3xl mb-5'>Let&apos;s get start</h4>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 mt-5 w-full mb-3'>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type='email'
            placeholder='Email'
            className='input'
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === 'pattern' && <FormError errorMessage='Please enter a valid email' />}
          <input
            {...register('password', {
              required: 'Password is required',
            })}
            type='password'
            placeholder='Password'
            className='input'
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === 'minLength' && <FormError errorMessage='Password must be more than 10 chars.' />}
          <select {...register('role', { required: true })} className='input'>
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Button canClick={formState.isValid} loading={loading} actionText='Create Account' />
          {createAccountMutationResult?.createAccount.error && (
            <FormError errorMessage={createAccountMutationResult.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to='/login' className='text-lime-600 hover:underline'>
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
