import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Button from '../ui/button.svelte';

describe('Button', () => {
	it('renders correctly', () => {
		render(Button, { children: 'Click me' });
		const button = screen.getByText('Click me');
		expect(button).toBeDefined();
	});
});
