import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { Button } from '@/components/Button';

describe('Button', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button title="Save" onPress={onPress} />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('hides the label and ignores presses while loading', () => {
    const onPress = jest.fn();
    render(<Button title="Save" onPress={onPress} loading />);
    expect(screen.queryByText('Save')).toBeNull();
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
