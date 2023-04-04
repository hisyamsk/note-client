import { IErrorResponse } from '../../interface/response.interface';
import User from './User';
import { useGetUsersQuery } from './usersApiSlice';

const UsersList = (): JSX.Element => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(
    {},
    {
      pollingInterval: 60 * 1000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError && error) {
    if ('status' in error) {
      const errorData = error.data as IErrorResponse;
      const errMsg = 'error' in error ? error.error : errorData.message;

      content = <p className="errmsg">{errMsg}</p>;
    } else {
      content = <p className="errmsg">{error.message}</p>;
    }
  }

  if (isSuccess && users) {
    const { ids } = users;

    const tableContent = ids.length
      ? ids.map((id) => <User key={id} userId={id} />)
      : null;

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default UsersList;
