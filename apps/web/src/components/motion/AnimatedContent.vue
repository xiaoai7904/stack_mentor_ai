<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  distance: 20,
  direction: "vertical",
  reverse: false,
  duration: 0.45,
  delay: 0,
  initialOpacity: 0,
  threshold: 0.05,
});

const element = useTemplateRef<HTMLElement>("element");
let animation: gsap.core.Tween | undefined;

onMounted(() => {
  if (!element.value) return;

  const axis = props.direction === "horizontal" ? "x" : "y";
  const offset = props.reverse ? -props.distance : props.distance;

  animation = gsap.fromTo(
    element.value,
    { [axis]: offset, opacity: props.initialOpacity },
    {
      [axis]: 0,
      opacity: 1,
      duration: props.duration,
      delay: props.delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element.value,
        start: `top ${(1 - props.threshold) * 100}%`,
        once: true,
      },
    },
  );
});

onBeforeUnmount(() => {
  animation?.scrollTrigger?.kill();
  animation?.kill();
});
</script>

<template>
  <div ref="element">
    <slot />
  </div>
</template>
