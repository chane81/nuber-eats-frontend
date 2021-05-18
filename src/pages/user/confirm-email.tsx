import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import useUrlQuery from '../../hooks/useUrlQuery';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const [isUnmounted, setIsUnmounted] = useState(false);
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const urlQuery = useUrlQuery();

  useEffect(() => {
    const code = urlQuery.get('code');

    (async () => {
      await verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    })();

    return () => setIsUnmounted(true);
  }, []);

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me) {
      // write cache
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });

      // route 이동시(history.push()) waining 이슈 대응
      // Warning: Can't perform a React state update on an unmounted component
      history.push('/');
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    },
  );

  return (
    <div className='mt-52 flex flex-col items-center justify-center'>
      <h2 className='text-lg mb-2 font-medium'>Confirming email...</h2>
      <h4 className='text-gray-700 text-sm'>
        Please wait, don&apos;t close this page...
      </h4>
    </div>
  );
};
