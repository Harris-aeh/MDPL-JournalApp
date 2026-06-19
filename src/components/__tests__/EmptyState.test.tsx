import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('renders the title and subtitle', () => {
    render(<EmptyState title="No entries yet" subtitle="Add your first note." />);
    expect(screen.getByText('No entries yet')).toBeTruthy();
    expect(screen.getByText('Add your first note.')).toBeTruthy();
  });
});
