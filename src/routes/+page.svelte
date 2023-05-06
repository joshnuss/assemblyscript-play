<script>
  import '../app.css'
  import { onMount } from 'svelte'
  import asc from 'assemblyscript/asc'
  import CodeMirror from 'svelte-codemirror-editor'
  import { javascript } from '@codemirror/lang-javascript'
  import { wat } from '$lib/wat'

  let source = `export function add(a: u32, b: u32): u32 {\n  return a + b;\n}`
  let result = null
  let compiling = false

  $: error = result?.error

  onMount(compile)

  async function handleChange(e) {
    source = e.detail
    compile()
  }

  async function compile() {
    compiling = true
    result = await asc.compileString(source)
    compiling = false
  }

  function formattedErrors() {
    return result.stderr.toString().split('\n')
  }
</script>

<header>
  <a href="https://assemblyscript.org">AssemblyScript</a> <em>Playground</em>
</header>

<main>
  <div class="pane">
    <CodeMirror value={source} lang={javascript({ typescript: true })} on:change={handleChange} />
  </div>

  <div class="pane">
    <CodeMirror value={result?.text ?? ''} lang={wat} readonly />
  </div>
</main>

{#if compiling || error}
  <footer class:error>
    {#if compiling}
      Compiling...
    {:else if error}
      {#each formattedErrors() as error}
        {@html error.replace(/ /g, '&nbsp;')}<br />
      {/each}
    {/if}
  </footer>
{/if}

<style>
  main {
    display: flex;
    flex: auto;
  }
  main .pane {
    font-family: var(--font-mono);
    font-size: var(--font-size-2);
    border-radius: 0;
    resize: none;
    flex: 1;
  }
  main .pane:first-of-type {
    border-right: solid var(--border-size-2) var(--gray-4);
  }

  header {
    padding: var(--size-2);
    font-weight: bold;
    color: var(--blue-8);
    border-bottom: solid var(--size-1) var(--blue-2);
  }

  header a {
    color:  inherit;
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
    font-family: var(--font-mono);
  }

  .error {
    background: var(--red-8);
    color: var(--gray-1);
  }
</style>
