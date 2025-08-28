import { beforeEach, describe, expect, it, vi } from 'vitest';

// goto 함수 모킹 (최상단)
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

// 브라우저 환경 강제 (최상단)
vi.mock('$app/environment', () => ({ browser: true }));

// localStorage 모킹 (최상단)
vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);

import * as nav from '$app/navigation';
import { render, waitFor } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render h1', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});

	it('redirects to /login when no auth token', async () => {
		render(Page);

		await waitFor(() => {
			expect(nav.goto).toHaveBeenCalledWith('/login');
		});
	});
});
