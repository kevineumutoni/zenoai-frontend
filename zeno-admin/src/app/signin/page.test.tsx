import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

let mockError: string | null = null;
let mockIsLoading: boolean = false;
const mockLogin = jest.fn();
jest.mock('../hooks/usefetchlogin', () => ({
  useFetchLogin: () => ({
    login: mockLogin,
    isLoading: mockIsLoading,
    error: mockError, 
  }),
}));

const typeLogin = (email = '', password = '') => {
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockIsLoading = false;
    mockError = null;
    mockPush.mockReset();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('can type email and password', () => {
    render(<LoginPage />);
    typeLogin('test@example.com', 'password123');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
  });

  it('does not allow login if both fields are empty', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('does not allow login if email is empty', () => {
    render(<LoginPage />);
    typeLogin('', 'password123');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('does not allow login if password is empty', () => {
    render(<LoginPage />);
    typeLogin('test@example.com', '');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('allows login when both fields are filled', () => {
    render(<LoginPage />);
    typeLogin('test@example.com', 'password123');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows loading indicator when isLoading is true', () => {
    mockIsLoading = true;
    render(<LoginPage />);
    const loadingButton = screen.getByRole('button', { name: /loading.../i });
    expect(loadingButton).toBeDisabled();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    mockError = "Invalid credentials";
    render(<LoginPage />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});