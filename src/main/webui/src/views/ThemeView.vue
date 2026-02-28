<script setup lang="ts">

import {useSpectrum, Playground} from "celerix-spectrum/vue";

const spectrum = useSpectrum();

</script>

<template>
    <Playground :spectrum="spectrum" />
</template>

<style scoped>
</style>
