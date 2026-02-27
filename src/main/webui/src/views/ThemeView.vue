<script setup lang="ts">

import {useSpectrum} from "celerix-spectrum/vue";
import {ref, watch} from "vue";

const spectrum = useSpectrum();

const activePresetKey = ref<keyof typeof THEME_PRESETS>('ocean');

const THEME_PRESETS = {
    ocean: {hue: 210, chroma: 0.14, lightness: { light: 0.5, dark: 0.3 }, name: 'Ocean Blue'},
    slateblue: {hue: 258, chroma: 0.09, lightness: { light: 0.5, dark: 0.3 }, name: 'Slateblue'},
    forest: {hue: 145, chroma: 0.12, lightness: { light: 0.5, dark: 0.3 }, name: 'Deep Forest'},
    sunset: {hue: 25, chroma: 0.18, lightness: { light: 0.5, dark: 0.3 }, name: 'Sunset Orange'},
    cyber: {hue: 310, chroma: 0.25, lightness: { light: 0.5, dark: 0.3 }, name: 'Cyber Neon'},
    slate: {hue: 210, chroma: 0.02, lightness: { light: 0.5, dark: 0.3 }, name: 'Professional Slate'},
} as const;

const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const {hue, chroma, lightness} = THEME_PRESETS[presetKey];
    let ln = Number(lightness.light);
    // If linked, this will automatically update both via our existing updateValue logic
    if (spectrum.active.mode === 'dark') {
        ln = Number(lightness.dark);
    }

    activePresetKey.value = presetKey;

    spectrum.updateValue({mode: 'light', key: 'hue', value: hue});
    spectrum.updateValue({mode: 'light', key: 'chroma', value: chroma});
    spectrum.updateValue({mode: 'light', key: 'lightness', value: ln});
}

/* let's make sure the lightness of the theme switches when the theme mode changes */
watch(
    () => spectrum.active.mode,
    (newMode) => {
        const currentPreset = THEME_PRESETS[activePresetKey.value];

        spectrum.updateValue({
            mode: newMode,
            key: 'lightness',
            value: currentPreset.lightness[newMode]
        });
    },
    { flush: 'post' }
);

/**
 * Universal handler for all theme sliders.
 * @param mode - 'light' | 'dark'
 * @param property - 'hue' | 'chroma'
 * @param event - The input event
 */
const updateThemeProperty = (
    mode: 'light' | 'dark',
    property: 'hue' | 'chroma' | 'lightness',
    event: Event
) => {
    const target = event.target as HTMLInputElement;
    if (target) {
        spectrum.updateValue({mode: mode, key: property, value: parseFloat(target.value)});
    }
};

</script>

<template>
    <div class="cluster g-3 align-stretch-important">
        <div class="card">

            <div class="card-body">

                <div class="stack g-3">

                    <!--region LCH Title-->
                    <div style="display:flex;justify-content:space-between;padding: 10px 10px 0;">
                        <h3 style="font-size:1.15rem">LCH Color Mixer</h3>
                        <div>
                            <div style="width:24px;height:24px;border-radius:25px;background-color:var(--brand)"></div>
                        </div>
                    </div>
                    <!--endregion-->

                    <!-- hr -->
                    <hr style="margin:0;padding:0"/>

                    <!--region rgb rainbow rectangle -->
                    <div style="width:100%;display: flex; justify-content: center;margin-bottom:2rem">
                        <div class="color-window" :style="{
                          '--current-h': spectrum.active.hue,
                          '--current-c': spectrum.active.chroma,
                          '--current-l': spectrum.active.lightness
                        }">
                            <div class="color-map-grid"></div>
                            <div class="picker-handle"></div>
                        </div>
                    </div>
                    <!--endregion-->

                    <!--region hue slider -->
                    <div class="hue-control">
                        <div style="display: flex;justify-content: space-between;">
                            <div>Hue</div>
                            <div><span id="hue-value">{{ spectrum.active.hue }}</span>°</div>
                        </div>
                        <input
                            type="range"
                            id="hue-slider"
                            min="0"
                            max="360"
                            :value="spectrum.active.hue"
                            @input="updateThemeProperty('light', 'hue', $event)"
                            class="custom-slider"
                        >
                    </div>
                    <!--endregion-->

                    <!--region chroma slider -->
                    <div class="chroma-control mt-1">
                        <div style="display: flex;justify-content: space-between;">
                            <div>Intensity <span class="text-muted">(Chroma)</span></div>
                            <div><span id="hue-value">{{ spectrum.active.chroma }}</span></div>
                        </div>
                        <input
                            type="range"
                            id="chroma-slider"
                            min="0"
                            max="0.37"
                            step="0.01"
                            :value="spectrum.active.chroma"
                            @input="updateThemeProperty('light', 'chroma', $event)"
                            class="chroma-slider"
                        >
                    </div>
                    <!--endregion-->

                    <!--region lightness slider -->
                    <div class="lightness-control mt-1">
                        <div style="display: flex;justify-content: space-between;">
                            <div>Lightness</div>
                            <div><span id="hue-value">{{ spectrum.active.lightness }}</span></div>
                        </div>
                        <input
                            type="range"
                            id="lightness-slider"
                            min="0"
                            max="1"
                            step="0.01"
                            :value="spectrum.active.lightness"
                            @input="updateThemeProperty('light', 'lightness', $event)"
                            class="lightness-slider"
                        >
                    </div>
                    <!--endregion-->

                </div>

                <hr style="padding:0"/>

                <!--region dark mode toggle -->
                <div style="display:flex; justify-content: space-between; align-items: center">
                    <div class="ps-2">Dark Mode</div>
                    <div style="display:flex;">
                        <div class="theme-controls-row">
                            <div class="control-item">
                                <span class="control-label">Follow OS</span>
                                <label class="toggle-switch">
                                    <input
                                        type="checkbox"
                                        :checked="spectrum.mode === 'auto'"
                                        @change="spectrum.setThemeMode(($event.target as HTMLInputElement).checked ? 'auto' : spectrum.active.mode)"
                                    >
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>

                            <div class="control-divider"></div>

                            <div class="control-item"
                                 :class="{ 'is-disabled': spectrum.mode === 'auto' }">
                                <span class="control-label">Dark Mode</span>
                                <label class="toggle-switch">
                                    <input
                                        type="checkbox"
                                        :disabled="spectrum.mode === 'auto'"
                                        :checked="spectrum.mode === 'dark'"
                                        @change="spectrum.setThemeMode(($event.target as HTMLInputElement).checked ? 'dark' : 'light')"
                                    >
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <!--endregion-->

                <hr style="padding:0"/>

                <!--region presets -->
                <div>
                    <div class="ps-2">Presets:</div>
                    <div class="celerix-themer ps-1">
                        <div class="preset-grid flex gap-2 mb-4">
                            <button
                                v-for="(data, key) in THEME_PRESETS"
                                :key="key"
                                @click="applyPreset(key)"
                                class="cx-button"
                                :style="{ background: `oklch(0.6 ${data.chroma} ${data.hue})` }"
                                :title="data.name"
                            >&nbsp;&nbsp;&nbsp;&nbsp;
                            </button>
                        </div>
                    </div>
                </div>
                <!--endregion-->

            </div>

        </div>

        <!--region Right Column -->
        <div class="stack g-3" style="flex-grow: 1">
            <div class="card">
                <div class="card-body">
                    <div class="py-3 px-3">
                        <div style="display: flex;align-items: flex-start; justify-content: space-between;">
                            <div>
                                <div style="font-size:2.5rem;font-weight:700">{{
                                        spectrum.wcag.ratio
                                    }}:1
                                </div>
                                <div>WCAG Accessibility Scorecard</div>
                            </div>
                            <div>
                                <div :class="spectrum.wcag.isPass ? 'success' : 'danger'"
                                     style="display:flex;padding-top:1px;padding-bottom:3px;justify-content:center;border-radius:50px">
                                    <div class="px-3">
                                        {{ spectrum.wcag.status }}<template v-if="spectrum.wcag.isPass">-PASS</template>
                                        <template v-else>-FAIL</template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr style="margin:0;padding:0" />

            <div class="card">
                <div class="card-body">
                    <div class="d-flex-col g-3 align-start pb-5 mt-3">
                        <div class="text-muted text-center cx-w-100">Brand 100-900
                            steps with text 'on-brand'
                        </div>
                        <div class="flex-jc-center g-2 cx-w-100">
                            <div v-for="step in [100, 200, 300, 400, 500, 600, 700, 800, 900]"
                                 :key="step"
                                 :class="`brand-${step}`"
                                 :style="{ fontWeight: step === 500 ? '900' : '500' }"
                                 style="color: var(--on-brand); display:flex; width:75px; height:75px; justify-content: center; align-items: center; border-radius: 4px; position: relative;">

                                {{ step }}

                                <template v-if="step === 500">
                                    <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0;
                                        border-left: 6px solid transparent;
                                        border-right: 6px solid transparent;
                                        border-top: 8px solid var(--brand);"></div>

                                    <div style="position: absolute; top: 90px; left: 50%; transform: translateX(-50%);
                                                display: flex; flex-direction: column; align-items: center; white-space: nowrap; line-height: 1.2;">
                                        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color:light-dark(black, white); opacity: 0.8;">
                                            Measure Point
                                        </span>
                                        <span :style="{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: spectrum.wcag.isPass ? 'var(--success)' : 'var(--danger)'
                                        }">
                                            {{ spectrum.wcag.status }} ({{ spectrum.wcag.ratio }}:1)
                                        </span>
                                    </div>
                                </template>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr style="margin:0;padding:0"/>

            <div class="card">
                <div class="card-body">
                    <div class="px-2 py-2">
                        <pre class="text-mono brand-300 p-3" style="border: 1px solid var(--separator);color:var(--on-brand)">
mode: {{ spectrum.mode }}
isLinked: {{ spectrum.isLinked }}
active: {{ spectrum.active }}
wcag: {{ spectrum.wcag }}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
        <!--endregion-->

    </div>
</template>

<style scoped>

.theme-controls-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 0.45rem;
    padding: 0 12px;
}

.control-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px; /* Space between text and switch */
    transition: all 0.3s ease;
}

.control-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted, #a1a1aa);
    white-space: nowrap;
}

.control-divider {
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
}

/* Logic for the disabled sibling */
.control-item.is-disabled {
    opacity: 0.3;
    filter: grayscale(1);
    pointer-events: none;
}

.color-window {
    position: relative;
    width: 240px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    /* This 12-step gradient ensures 0-360 maps linearly to 0-100% */
    background: linear-gradient(to right,
    #ff0000 0%, #ff8000 8.3%, #ffff00 16.6%, #80ff00 25%,
    #00ff00 33.3%, #00ff80 41.6%, #00ffff 50%, #0080ff 58.3%,
    #0000ff 66.6%, #8000ff 75%, #ff00ff 83.3%, #ff0080 91.6%, #ff0000 100%);
}

/* Vertical Lightness Gradient */
.color-window::before {
    content: "";
    position: absolute;
    inset: 0;
    /* Fades from White (top) to Transparent (mid) to Black (bottom) */
    background: linear-gradient(to bottom,
    white 0%,
    transparent 45%,
    transparent 55%,
    black 100%);
    opacity: 0.6;
    pointer-events: none;
}

.color-map-grid {
    position: absolute;
    inset: 0;
    /* 10% steps map perfectly to 0.1 increments of Lightness/Hue */
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px);
    background-size: 5% 5%;
    pointer-events: none;
}

html[data-theme="dark"] .layer-intensity {
    //mix-blend-mode: soft-light;
}

.picker-handle {
    /* Use the variables we injected above */
    left: calc((var(--current-h) / 360) * 100%);
    top: calc(100% - (var(--current-l) * 100%));

    /* The rest of your polished styles */
    position: absolute;
    width: 12px;
    height: 12px;
    transform: translate(-50%, -50%) scale(calc(1 + var(--current-c) * 2));
    //background-color: oklch(var(--current-l) var(--current-c) var(--current-h));
    border: 2px solid white;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    transition: left 0.1s ease-out, top 0.1s ease-out;
}

.chroma-overlay {
    position: absolute;
    inset: 0;
    /* This fades from the vibrant hue colors at the top to neutral gray at the bottom */
    background: linear-gradient(to top, transparent, rgba(128, 128, 128, 0.5));
}

.hue-control, .chroma-control, .lightness-control {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
    padding-left: var(--s-3);
    padding-right: var(--s-3);
    background: var(--bg-surface); /* Using your semantic token */
    border-radius: var(--s-2);
}

.custom-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 22px;
    border-radius: 16px;
    /* A rainbow gradient representing the OKLCH hue circle */
    background: linear-gradient(to right,
    oklch(0.6 0.18 0deg), oklch(0.6 0.18 90deg),
    oklch(0.6 0.18 180deg), oklch(0.6 0.18 270deg),
    oklch(0.6 0.18 360deg)
    );
    outline: none;
}

/* The Handle (Thumb) */
.custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--brand-seed); /* Glows with the selected color */
    cursor: pointer;
    /* box-shadow: 0 0 10px rgba(0,0,0,0.2);*/
    transition: transform 0.1s ease;
}

.custom-slider::-webkit-slider-thumb:active {
    transform: scale(1.2);
}

.chroma-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 22px;
    border-radius: 16px;
    /* Track goes from Gray to the Current Brand Hue */
    background: linear-gradient(to right,
    oklch(0.6 0 var(--brand-hue)),
    oklch(0.6 0.37 var(--brand-hue))
    );
    outline: none;
}

.chroma-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    /* The thumb border shows the current intensity */
    border: 3px solid var(--brand-seed);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.lightness-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 22px;
    border-radius: 16px;
    /* Track goes from Gray to the Current Brand Hue */
    background: linear-gradient(to right,
    oklch(0 var(--brand-chroma) var(--brand-hue)),
    oklch(1 var(--brand-chroma) var(--brand-hue))
    );
    outline: none;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        /* The thumb border shows the current intensity */
        border: 3px solid var(--brand-seed);
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
}
</style>
