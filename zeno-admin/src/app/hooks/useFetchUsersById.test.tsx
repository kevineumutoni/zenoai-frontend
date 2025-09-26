import { render, screen, waitFor } from '@testing-library/react';
import useFetchUsers, { User } from './useFetchUsersById';
import * as fetchModule from '../utils/fetchUser';

function TestComponent({ ids }: { ids: number[] }) {
  const { users, loading, error } = useFetchUsers(ids);

  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="users">{JSON.stringify(users)}</span>
      <span data-testid="error">{error ?? ''}</span>
    </div>
  );
}

describe('useFetchUsers', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      first_name: 'arsema',
      last_name: 'aregawi',
      email: 'arsema@example.com',
      image: null,
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts loading true and empty users', async () => {
    render(<TestComponent ids={[1, 2]} />);
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('users').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe('');
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
  });

  it('should fetch and set users when successful', async () => {
    jest.spyOn(fetchModule, 'fetchUsers').mockResolvedValueOnce(mockUsers);

    render(<TestComponent ids={[1, 2]} />);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('users').textContent).toBe(JSON.stringify(mockUsers));
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('should set error on fetch failure', async () => {
    const errorMessage = 'Fetch failed';
    jest.spyOn(fetchModule, 'fetchUsers').mockRejectedValueOnce(new Error(errorMessage));

    render(<TestComponent ids={[1, 2]} />);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('users').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe(errorMessage);
  });

  it('should immediately handle empty ids array', async () => {
    render(<TestComponent ids={[]} />);
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('users').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe('');
  });
  
});
