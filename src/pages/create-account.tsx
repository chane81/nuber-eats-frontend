import { useMutation, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
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
  const [createAccountMutation] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
  );

  const { errors } = formState;

  const onSubmit = () => {};
  console.info(watch());

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
            })}
            type='email'
            placeholder='Email'
            className='input'
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
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
          <Button canClick={formState.isValid} loading={false} actionText='Create Account' />
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
