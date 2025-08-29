<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let isDarkMode: boolean = false; // $state(false); 차이

	const toggleTheme = () => {
		const currentTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
		localStorage.setItem('theme', currentTheme);
		document.body.classList.toggle('dark');
		isDarkMode = currentTheme === 'dark';
	};

	onMount(() => {
		if (browser) {
			const theme = localStorage.getItem('theme');
			if (theme) {
				isDarkMode = theme === 'dark';
				document.body.classList.add(theme);
			}

			// 로그인 상태 확인 (로컬 스토리지에서 토큰 확인)
			const token = localStorage.getItem('authToken');
			if (!token) {
				goto('/login');
			}
		}
	});
</script>

<div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
	<button onclick={toggleTheme} aria-label="Toggle theme">
		{isDarkMode ? '다크 모드' : '라이트 모드'}
	</button>

	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h1 class="text-center text-3xl font-extrabold">메인 페이지에 오신 것을 환영합니다!</h1>
		<p class="mt-2 text-center text-sm text-text-secondary">로그인이 성공적으로 완료되었습니다.</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<div class="text-center">
				<p class="mb-4">현재 로그인된 상태입니다.</p>
				<button
					onclick={() => {
						localStorage.removeItem('authToken');
						goto('/login');
					}}
					class="flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
				>
					로그아웃
				</button>
			</div>
		</div>
	</div>
</div>
