<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let currentPath = '';
	let navigationHistory: string[] = [];

	// 현재 페이지 경로 추적
	$: currentPath = $page.url.pathname;
	$: if (currentPath) {
		navigationHistory = [...navigationHistory, currentPath];
	}

	function navigateTo(path: string) {
		console.log(`goto('${path}') 호출됨`);
		goto(path);
	}

	function goBack() {
		if (navigationHistory.length > 1) {
			const previousPath = navigationHistory[navigationHistory.length - 2];
			navigationHistory = navigationHistory.slice(0, -1);
			goto(previousPath);
		}
	}

	function clearHistory() {
		navigationHistory = [];
	}

	// goto 함수의 다양한 동작을 시뮬레이션
	async function simulateNavigation(path: string, options?: any) {
		const startTime = Date.now();
		console.log(`🚀 goto('${path}', ${JSON.stringify(options)}) 시작`);

		try {
			// 실제 goto 호출
			await goto(path, options);

			const endTime = Date.now();
			const duration = endTime - startTime;

			console.log(`✅ goto('${path}') 완료 - 소요시간: ${duration}ms`);
			console.log(`📍 현재 URL: ${window.location.href}`);
			console.log(`📚 히스토리 길이: ${window.history.length}`);

			// 성공 알림
			alert(`네비게이션 성공!\n경로: ${path}\n소요시간: ${duration}ms\n현재 URL: ${window.location.href}`);
		} catch (error) {
			console.error(`❌ goto('${path}') 실패:`, error);
			alert(`네비게이션 실패: ${error}`);
		}
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">goto 함수 테스트 페이지</h1>

		<div class="mb-6 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">현재 상태</h2>
			<div class="space-y-2">
				<p><strong>현재 경로:</strong> <code class="rounded bg-gray-100 px-2 py-1">{currentPath}</code></p>
				<p><strong>네비게이션 히스토리:</strong></p>
				<div class="max-h-32 overflow-y-auto rounded bg-gray-50 p-3">
					{#each navigationHistory as path, index}
						<div class="text-sm {index === navigationHistory.length - 1 ? 'font-bold text-blue-600' : 'text-gray-600'}">
							{index + 1}. {path}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<!-- 기본 네비게이션 -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium">기본 네비게이션</h3>
				<div class="space-y-3">
					<button
						onclick={() => navigateTo('/')}
						class="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						홈으로 이동 (/)
					</button>
					<button
						onclick={() => navigateTo('/login')}
						class="w-full rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
					>
						로그인 페이지 (/login)
					</button>
					<button
						onclick={() => navigateTo('/test')}
						class="w-full rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
					>
						현재 페이지 (/test)
					</button>
				</div>
			</div>

			<!-- 동적 경로 테스트 -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium">동적 경로 테스트</h3>
				<div class="space-y-3">
					<button
						onclick={() => navigateTo('/user/123')}
						class="w-full rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
					>
						사용자 프로필 (/user/123)
					</button>
					<button
						onclick={() => navigateTo('/product/abc')}
						class="w-full rounded bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
					>
						상품 상세 (/product/abc)
					</button>
					<button
						onclick={() => navigateTo('/search?q=test&category=all')}
						class="w-full rounded bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
					>
						검색 페이지 (쿼리 포함)
					</button>
				</div>
			</div>

			<!-- 특수 케이스 테스트 -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium">특수 케이스 테스트</h3>
				<div class="space-y-3">
					<button
						onclick={() => navigateTo('https://google.com')}
						class="w-full rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
					>
						외부 URL (https://google.com)
					</button>
					<button
						onclick={() => navigateTo('#section1')}
						class="w-full rounded bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700"
					>
						페이지 내 앵커 (#section1)
					</button>
					<button
						onclick={() => navigateTo('?param=value')}
						class="w-full rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
					>
						쿼리만 변경 (?param=value)
					</button>
				</div>
			</div>
		</div>

		<!-- 히스토리 관리 -->
		<div class="mt-6 rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium">히스토리 관리</h3>
			<div class="flex space-x-4">
				<button
					onclick={goBack}
					disabled={navigationHistory.length <= 1}
					class="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					뒤로 가기
				</button>
				<button
					onclick={clearHistory}
					class="rounded bg-gray-400 px-4 py-2 text-white transition-colors hover:bg-gray-500"
				>
					히스토리 초기화
				</button>
			</div>
		</div>

		<!-- goto 옵션 테스트 -->
		<div class="mt-6 rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium">goto 옵션 테스트</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-3">
					<button
						onclick={() => simulateNavigation('/login', { replaceState: true })}
						class="w-full rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
					>
						replaceState: true (히스토리 교체)
					</button>
					<button
						onclick={() => simulateNavigation('/login', { noScroll: true })}
						class="w-full rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
					>
						noScroll: true (스크롤 방지)
					</button>
					<button
						onclick={() => simulateNavigation('/login', { keepFocus: true })}
						class="w-full rounded bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
					>
						keepFocus: true (포커스 유지)
					</button>
				</div>
				<div class="space-y-3">
					<button
						onclick={() => simulateNavigation('/login', { replaceState: true, noScroll: true })}
						class="w-full rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
					>
						복합 옵션 (replaceState + noScroll)
					</button>
					<button
						onclick={() => simulateNavigation('/login', { replaceState: true, keepFocus: true })}
						class="w-full rounded bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
					>
						복합 옵션 (replaceState + keepFocus)
					</button>
					<button
						onclick={() => simulateNavigation('/login', { replaceState: true, noScroll: true, keepFocus: true })}
						class="w-full rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
					>
						모든 옵션 조합
					</button>
				</div>
			</div>
		</div>

		<!-- 고급 테스트 -->
		<div class="mt-6 rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium">고급 테스트</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-3">
					<button
						onclick={() => simulateNavigation('/nonexistent')}
						class="w-full rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
					>
						존재하지 않는 경로 테스트
					</button>
					<button
						onclick={() => simulateNavigation('mailto:test@example.com')}
						class="w-full rounded bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700"
					>
						mailto: 링크 테스트
					</button>
					<button
						onclick={() => simulateNavigation('tel:+1234567890')}
						class="w-full rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
					>
						tel: 링크 테스트
					</button>
				</div>
				<div class="space-y-3">
					<button
						onclick={() => simulateNavigation('/test', { replaceState: true })}
						class="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						현재 페이지로 replaceState
					</button>
					<button
						onclick={() => simulateNavigation('?test=value', { replaceState: true })}
						class="w-full rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
					>
						쿼리만 변경 (replaceState)
					</button>
					<button
						onclick={() => simulateNavigation('#test-section', { noScroll: true })}
						class="w-full rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
					>
						앵커로 이동 (noScroll)
					</button>
				</div>
			</div>
		</div>

		<!-- 콘솔 로그 안내 -->
		<div class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
			<h3 class="mb-2 text-lg font-medium text-blue-900">테스트 방법</h3>
			<div class="space-y-2 text-sm text-blue-800">
				<p>• 각 버튼을 클릭하면 브라우저의 개발자 도구 콘솔에 goto 함수 호출 로그가 출력됩니다.</p>
				<p>• 네비게이션 히스토리가 실시간으로 추적됩니다.</p>
				<p>• 시뮬레이션 버튼을 사용하면 goto 함수의 동작을 자세히 분석할 수 있습니다.</p>
				<p>• 콘솔에서 🚀, ✅, ❌ 이모지와 함께 로그를 확인할 수 있습니다.</p>
			</div>
		</div>

		<!-- 브라우저 정보 -->
		<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
			<h3 class="mb-2 text-lg font-medium text-gray-900">브라우저 정보</h3>
			<div class="space-y-1 text-sm text-gray-700">
				<p><strong>User Agent:</strong> {browser ? navigator.userAgent : '서버 사이드'}</p>
				<p><strong>현재 URL:</strong> {browser ? window.location.href : '서버 사이드'}</p>
				<p><strong>히스토리 길이:</strong> {browser ? window.history.length : '서버 사이드'}</p>
			</div>
		</div>
	</div>
</div>

