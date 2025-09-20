import fetchMock from "jest-fetch-mock";
import { fetchCurrentAdmin, updateCurrentAdmin } from "./fetchAdmins";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  localStorage.clear();
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('id', '91');
});

describe('fetchCurrentAdmin', () => {
  it('fetches current admin data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 91,
        first_name: 'Tirsitey',
        last_name: 'Berihu',
        email: 'merry@gmail.com',
        role: 'Admin',
        image: 'fake-url',
        created_at: '2025-09-19T21:18:58.271883Z'
      })
    );

    const admin = await fetchCurrentAdmin();
    expect(admin.id).toBe(91);
    expect(admin.email).toBe('merry@gmail.com');
    expect(admin.role).toBe('Admin');
  });

  it('throws error if no token found', async () => {
    localStorage.removeItem('token');
    await expect(fetchCurrentAdmin()).rejects.toThrow('No token found in localStorage');
  });

  it('throws error if no id found', async () => {
    localStorage.removeItem('id');
    await expect(fetchCurrentAdmin()).rejects.toThrow('No id or user_id found in localStorage. Please login.');
  });
});

describe('updateCurrentAdmin', () => {
  it('updates admin data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 91,
        first_name: 'Updated',
        last_name: 'Admin',
        email: 'update@gmail.com',
        role: 'Admin',
        image: 'new-image-url',
        created_at: '2025-09-19T21:18:58.271883Z'
      })
    );

    const updated = await updateCurrentAdmin('91', {
      first_name: 'Updated',
      last_name: 'Admin',
      email: 'update@gmail.com',
      image: 'new-image-url'
    });

    expect(updated.first_name).toBe('Updated');
    expect(updated.email).toBe('update@gmail.com');
  });

  it('returns 401 Response if no token', async () => {
    localStorage.removeItem('token');

    const result = await updateCurrentAdmin('91', { first_name: 'Test' });

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(401);
    expect(await result.text()).toBe('No token found');
  });
});