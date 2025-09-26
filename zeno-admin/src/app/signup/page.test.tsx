import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUpPage from './page';


jest.mock('next/navigation', () => ({
 useRouter: () => ({
   push: jest.fn(),
 }),
}));


jest.mock('./components/TermsModal', () => (props: any) => (
 props.open ? (
   <div data-testid="terms-modal">
     <button aria-label="Close" onClick={props.onClose}>Close</button>
     <button disabled={!props.agreed} onClick={props.onAgree}>Agree</button>
     <input
       type="checkbox"
       checked={props.agreed}
       onChange={() => props.setAgreed(!props.agreed)}
       aria-label="Agree Checkbox"
     />
   </div>
 ) : null
));


jest.mock('../hooks/useFetchSignUp', () => ({
 useFetchSignUp: () => ({
   signUp: jest.fn(async () => ({})),
   isLoading: false,
   error: null,
 }),
}));


describe('SignUpPage', () => {
 it('renders all form fields and buttons', () => {
   render(<SignUpPage />);
   expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
   expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
   expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
   expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
   expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
   expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
   expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
   expect(screen.getByText(/Agree to/i)).toBeInTheDocument();
   expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
 });


 it('shows error if password and confirmPassword do not match', async () => {
   render(<SignUpPage />);
   fireEvent.change(screen.getByPlaceholderText(/First Name/i), { target: { value: 'Test' } });
   fireEvent.change(screen.getByPlaceholderText(/Last Name/i), { target: { value: 'User' } });
   fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@email.com' } });
   fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'abc123' } });
   fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'xyz789' } });
   fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
   const errorMessages = await screen.findAllByText(/Passwords do not match/i, { exact: false });
   expect(errorMessages.length).toBeGreaterThan(0);
 });


 it('shows error if not agreed to terms', async () => {
   render(<SignUpPage />);
   fireEvent.change(screen.getByPlaceholderText(/First Name/i), { target: { value: 'Test' } });
   fireEvent.change(screen.getByPlaceholderText(/Last Name/i), { target: { value: 'User' } });
   fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@email.com' } });
   fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'abc123' } });
   fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'abc123' } });
   fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
   expect(await screen.findByText(/You must agree to terms and conditions/i, { exact: false })).toBeInTheDocument();
 });


 it('opens terms modal when clicking terms and conditions', () => {
   render(<SignUpPage />);
   fireEvent.click(screen.getByText(/terms and conditions/i));
   expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
 });


 it('allows agreement inside modal and closes modal', () => {
   render(<SignUpPage />);
   fireEvent.click(screen.getByText(/terms and conditions/i));
   const checkbox = screen.getByLabelText(/Agree Checkbox/i);
   fireEvent.click(checkbox);
   const agreeButton = screen.getByText(/^Agree$/);
   fireEvent.click(agreeButton);
   expect(screen.queryByTestId('terms-modal')).not.toBeInTheDocument();
 });


 it('toggles agreement with main checkbox', () => {
   render(<SignUpPage />);
   const mainCheckbox = screen.getByRole('checkbox');
   expect(mainCheckbox).not.toBeChecked();
   fireEvent.click(mainCheckbox);
   expect(mainCheckbox).toBeChecked();
 });
});

