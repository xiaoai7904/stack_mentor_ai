<script setup lang="ts">
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";

const props = defineProps<{
  content: string;
  language: string;
  startLine: number;
}>();

(globalThis as typeof globalThis & {
  MonacoEnvironment?: { getWorker: () => Worker };
}).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};

const container = useTemplateRef<HTMLDivElement>("container");
let editor: monaco.editor.IStandaloneCodeEditor | undefined;

onMounted(() => {
  if (!container.value) return;

  editor = monaco.editor.create(container.value, {
    value: props.content,
    language: props.language,
    theme: "vs-dark",
    readOnly: true,
    automaticLayout: true,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 13,
    lineHeight: 22,
    lineNumbers: (line: number) => String(props.startLine + line - 1),
    minimap: { enabled: false },
    folding: true,
    glyphMargin: false,
    lineDecorationsWidth: 10,
    renderLineHighlight: "line",
    roundedSelection: false,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    overviewRulerBorder: false,
    padding: { top: 14, bottom: 14 },
  });
});

watch(
  () => props.content,
  (content) => {
    editor?.setValue(content);
  },
);

function revealSourceLine(sourceLine: number) {
  const editorLine = Math.max(1, sourceLine - props.startLine + 1);
  editor?.revealLineInCenter(editorLine);
  editor?.setPosition({ lineNumber: editorLine, column: 1 });
  editor?.focus();
}

defineExpose({ revealSourceLine });

onBeforeUnmount(() => {
  editor?.dispose();
});
</script>

<template>
  <div ref="container" class="source-code-editor" />
</template>
