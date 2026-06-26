import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('weekly reset', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps pinned entries when clearing the week', () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /tilføj/i })[0]);
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Løb' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /gem/i }));

    fireEvent.click(screen.getByText('Løb'));
    fireEvent.click(screen.getByRole('button', { name: /fastgør/i }));
    fireEvent.click(screen.getByRole('button', { name: /gem/i }));

    fireEvent.click(screen.getByRole('button', { name: /ryd uge/i }));
    fireEvent.click(screen.getByRole('button', { name: /ja, ryd ugen/i }));

    expect(screen.getByText('Løb')).toBeInTheDocument();
  });
});
