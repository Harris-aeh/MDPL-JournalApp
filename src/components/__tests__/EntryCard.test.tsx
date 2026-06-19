import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { EntryCard } from '@/components/EntryCard';
import type { Entry } from '@/types';

const entry: Entry = {
  id: 'abc',
  title: 'Morning hike',
  note: 'Saw a deer near the ridge',
  createdAt: new Date(2026, 5, 5).getTime(),
};

describe('EntryCard', () => {
  it('renders the entry title and note', () => {
    render(<EntryCard entry={entry} onPress={() => {}} />);
    expect(screen.getByText('Morning hike')).toBeTruthy();
    expect(screen.getByText('Saw a deer near the ridge')).toBeTruthy();
  });

  it('calls onPress with the entry id when tapped', () => {
    const onPress = jest.fn();
    render(<EntryCard entry={entry} onPress={onPress} />);
    fireEvent.press(screen.getByText('Morning hike'));
    expect(onPress).toHaveBeenCalledWith('abc');
  });
});
