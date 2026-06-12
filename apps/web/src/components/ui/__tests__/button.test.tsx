import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByText(/delete/i);
    // Based on shadcn/ui typical destructive classes
    expect(buttonElement.className).toContain('bg-destructive');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByText(/disabled/i);
    expect(buttonElement).toBeDisabled();
  });
});
