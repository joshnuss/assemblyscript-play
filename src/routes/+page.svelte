<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import asc from 'assemblyscript/asc';

	let source = `export function test(): void {\n}`;
	let result = null;
	let compiling = false;

	$: error = result?.error;

	onMount(compile);

	async function handleKeypress(e) {
		console.log('called');
		console.log({ v: e.target.value });
		source = e.target.value;
		compile();
	}

	async function compile() {
		compiling = true;
		result = await asc.compileString(source);

		console.log(result);

		compiling = false;
	}

	function formattedErrors() {
		return result.stderr.toString().split('\n');
	}
</script>

<header>
	AssemblyScript <em>Playground</em>
</header>

<main>
	<textarea on:keyup={handleKeypress} value={source} />
	<textarea value={result?.text ?? ''} readonly />
</main>

{#if compiling || error}
	<footer class:error>
		{#if compiling}
			Compiling...
		{:else if error}
			{#each formattedErrors() as error}
				{error}<br />
			{/each}
		{/if}
	</footer>
{/if}

<style>
	main {
		display: flex;
		flex: auto;
	}
	main textarea {
		font-family: var(--font-mono);
		border-radius: 0;
		resize: none;
		flex: 1;
	}
	main textarea:focus-visible {
		outline: none;
	}
	main textarea:first-of-type {
		border-right: solid var(--border-size-2) var(--gray-4);
	}

	header {
		padding: var(--size-2);
		font-weight: bold;
		color: var(--blue-8);
		border-bottom: solid var(--size-1) var(--blue-2);
	}
	header em {
		font-style: normal;
		color: var(--blue-4);
	}

	footer {
		position: fixed;
		bottom: 0px;
		padding: var(--size-2);
		z-index: 10;
		background: var(--gray-4);
		width: 100vw;
	}

	.error {
		background: var(--red-8);
		color: var(--gray-1);
	}
</style>
