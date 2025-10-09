import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsModal from '.';


describe('TermsModal', () => {
 const defaultProps = {
   open: true,
   agreed: false,
   setAgreed: jest.fn(),
   onClose: jest.fn(),
   onAgree: jest.fn(),
 };


 it('renders nothing when open is false', () => {
   render(
     <TermsModal
       {...defaultProps}
       open={false}
     />
   );
   expect(screen.queryByText(/Zeno AI Terms and Conditions/i)).not.toBeInTheDocument();
 });


 it('renders the modal when open is true', () => {
   render(<TermsModal {...defaultProps} />);
   expect(screen.getByText(/Zeno AI Terms and Conditions/i)).toBeInTheDocument();
   expect(screen.getByText(/1. Introduction and Acceptance/i)).toBeInTheDocument();
   expect(screen.getByText(/2. Data Collection and Use/i)).toBeInTheDocument();
   expect(screen.getByText(/3. Data Security and Encryption/i)).toBeInTheDocument();
   expect(screen.getByText(/4. Data Localization & Cross-Border Transfer/i)).toBeInTheDocument();
   expect(screen.getByText(/5. Your Rights/i)).toBeInTheDocument();
   expect(screen.getByText(/6. Chats Usage Policy/i)).toBeInTheDocument();
   expect(screen.getByText(/7. Transparency and Explainability/i)).toBeInTheDocument();
   expect(screen.getByText(/8. Contact Us/i)).toBeInTheDocument();
   expect(screen.getByText(/Disclaimer/i)).toBeInTheDocument();
 });


 it('calls onClose when close button is clicked', () => {
   render(<TermsModal {...defaultProps} />);
   const closeButton = screen.getByLabelText(/Close/i);
   fireEvent.click(closeButton);
   expect(defaultProps.onClose).toHaveBeenCalled();
 });


 it('calls setAgreed when checkbox is clicked', () => {
   render(<TermsModal {...defaultProps} />);
   const checkbox = screen.getByRole('checkbox');
   fireEvent.click(checkbox);
   expect(defaultProps.setAgreed).toHaveBeenCalled();
 });


 it('calls onAgree when agree button is clicked and agreed is true', () => {
   render(<TermsModal {...defaultProps} agreed={true} />);
   const agreeButton = screen.getByText(/^Agree$/i);
   fireEvent.click(agreeButton);
   expect(defaultProps.onAgree).toHaveBeenCalled();
 });




 it('agree button is enabled when agreed is true', () => {
   render(<TermsModal {...defaultProps} agreed={true} />);
   const agreeButton = screen.getByText(/^Agree$/i);
   expect(agreeButton).not.toHaveAttribute('disabled');
 });
});

