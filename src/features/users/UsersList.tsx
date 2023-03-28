import User from './User';
import { useGetUsersQuery } from './usersApiSlice';

const UsersList = (): JSX.Element => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60 * 1000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError && error) {
    if ('status' in error) {
      const errMsg =
        'error' in error ? error.error : JSON.stringify(error.data);

      content = <p className="errmsg">{errMsg}</p>;
    } else {
      content = <div>{error.message}</div>;
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
