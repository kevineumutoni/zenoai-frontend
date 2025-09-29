import { render, screen } from '@testing-library/react';
import UserMessage from '.';

const mockImageFile = {
  file: new File([''], 'photo.jpg', { type: 'image/jpeg' }),
  previewUrl: 'blob:http://localhost',
};

const mockPdfFile = {
  file: new File([''], 'document.pdf', { type: 'application/pdf' }),
  previewUrl: 'blob:http://localhost',
};

const mockTextFile = {
  file: new File([''], 'notes.txt', { type: 'text/plain' }),
  previewUrl: 'blob:http://localhost/text-url',
};

describe('UserMessage', () => {
  it('renders text message with correct background and alignment', () => {
    const testText = 'Hello, this is a user message!';
    render(<UserMessage text={testText} />);

    const messageBubble = screen.getByText(testText).closest('div');
    
    expect(screen.getByText(testText)).toBeInTheDocument();
    
    expect(messageBubble).toHaveClass('bg-[#9FF8F8]');
    
    expect(messageBubble).toHaveClass('text-black');
    
    const container = messageBubble?.parentElement?.parentElement;
    expect(container).toHaveClass('justify-end');
  });

  it('renders image file preview correctly', () => {
    render(<UserMessage text="" files={[mockImageFile]} />);

    const img = screen.getByAltText('photo.jpg');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockImageFile.previewUrl);
  });

  it('renders PDF file with icon and filename', () => {
    render(<UserMessage text="" files={[mockPdfFile]} />);

    const pdfIcon = screen.getByText('document.pdf').closest('div')?.querySelector('svg');
    expect(pdfIcon).toBeInTheDocument();
    
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    
    expect(screen.getByText('document.pdf').closest('div')).toContainHTML('text-red-500');
  });

  it('renders generic file with default icon', () => {
    render(<UserMessage text="" files={[mockTextFile]} />);

    const fileIcon = screen.getByText('notes.txt').closest('div')?.querySelector('svg');
    expect(fileIcon).toBeInTheDocument();
    
  });

  it('renders both text and files together', () => {
    const testText = 'Check out this file:';
    render(<UserMessage text={testText} files={[mockPdfFile]} />);

    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('handles multiple files correctly', () => {
    render(<UserMessage text="" files={[mockImageFile, mockPdfFile, mockTextFile]} />);

    expect(screen.getByAltText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('notes.txt')).toBeInTheDocument();

  });

});