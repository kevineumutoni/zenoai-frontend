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
    await expect(fetchCurrentAdmin()).rejects.toThrow('Missing token or id');
  });

  it('throws error if no id found', async () => {
    localStorage.removeItem('id');
    await expect(fetchCurrentAdmin()).rejects.toThrow('Missing token or id');
  });
});

describe('updateCurrentAdmin', () => {
  it('updates admin data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 91,
        first_name: 'Tirsit',
        last_name: 'Teshome',
        email: 'tt@gmail.com',
        role: 'Admin',
        image: 'new-image-url',
        created_at: '2025-09-19T21:18:58.271883Z'
      })
    );

    const updated = await updateCurrentAdmin('91', {
      first_name: 'Tirsit',
      last_name: 'Teshome',
      email: 'tt@gmail.com',
      image: 'new-image-url'
    });

    expect(updated.first_name).toBe('Tirsit');
    expect(updated.last_name).toBe('Teshome');
    expect(updated.email).toBe('tt@gmail.com');
  });

  it('throws error if no token', async () => {
    localStorage.removeItem('token');
    await expect(updateCurrentAdmin('91', { first_name: 'Test' })).rejects.toThrow('No token found');
  });
});