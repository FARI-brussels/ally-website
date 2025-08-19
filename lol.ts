interface LayerState {
  showStibStopsLayer: boolean;
  [key: string]: boolean;
}

export const useLayerStore = defineStore('layer', {
  state: () => ({
    showStibStopsLayer: ref(true),
  } as LayerState),
  actions: {
    toggleStibStopsLayer() { this.showStibStopsLayer = !this.showStibStopsLayer; },
  },
});



//contains the dependencies on pinia and vue, and tanstack query (or pinia colada)

export function useCesiumFeature<T>({ queryKey, fetchFn, parser, layerId, isVisible, entityConfig }: FeatureConfig<T>) {
  const viewer = inject<Ref<Cesium.Viewer | null>>('cesiumViewer'); //injected cesium viewer
  const layerStore = useLayerStore(); //use the layer store to get the visibility of the layer

  const isVisible = () => {
    const key = visibilityKey ?? `show${layerId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')}Layer` as keyof LayerState;
    if (!(key in layerStore.$state)) {
      console.warn(`Visibility key ${key} not found in layerStore`);
      return false;
    }
    return layerStore.state[key] ?? false;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: fetchFn,
    select: parser,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 120,
    retry: 2,
    enabled,
  });

  watch(§
    [data, () => isVisible(), () => viewer?.value],
    ([newData, visible, viewerInstance]) => {
      if (!viewerInstance || !newData) return;
      viewerInstance.entities.suspendEvents();
      viewerInstance.entities.removeById(layerId);
      if (visible) {
        newData.forEach((item) => {
          viewerInstance.entities.add({
            id: `${layerId}-${item.pointId || item.id || Math.random()}`,
            ...entityConfig(item),
          });
        });
      }
      viewerInstance.entities.resumeEvents();
      viewerInstance.scene.requestRender();
    },
    { immediate: true }
  );

  return { data, isLoading, isError, error };
}



//create a stack-agnostic function that fetches data from an api and returns it

export async function fetchStibStops(): Promise<StibApiResponse> {
  try {
    //implement
  } catch (error) {
    //implement
  }
}


//create a stack-agnostic function that parses the data and returns it

export function parseStibStops(data: any): StibStop[] {
  //implement
}

// Maybe a bit unnecessary here but it means we can use it like this in other libraries that does not use vue/tanstack/pinia:

async function getApiData({caller, parser } : { caller: () => Promise<any>, parser: (data: any) => CesiumFeature }): CesiumFeature {
  const data = await caller();
  return parser(data);
}


getApiData({caller: fetchStibStops, parser: parseStibStops});


// then in a stib specific composable, use the generic composable, along with the fetch and parse functions to create a stib specific composable

export function useStibStops() {
  return useCesiumFeature<StibStop>({ // have a StibStop type that is a subset of the generic type
    queryKey: ['stibStops'],
    fetchFn: fetchStibStops, //the
    parser: stibParser, //the parser function that parses the data and returns the data in the correct format
    layerId: 'stib-stops', //the layer id
    entityConfig: (stop) => ({ 
      name: `${stop.nameFr} / ${stop.nameNl}`,
      position: Cesium.Cartesian3.fromDegrees(stop.longitude, stop.latitude, 100),
      point: {
        pixelSize: 4,
        color: Cesium.Color.BLUE.withAlpha(0.7),
      }, //this can also be a decoupled function that returns the entity config
      description: `<p>${stop.nameFr} (${stop.pointId})</p>`,
    }),
  });
}

//the generic composable now handles the watcher and caching, which means you should only really need to do something like this:

import { useStibStops } from './composables/useStibStops';
import { useLayerStore } from './stores/layerStore';

const { isLoading: stibStopsLoading } = useStibStops();

<template>
  <div>
    <CesiumViewer />
    <div style="position: absolute; top: 10px; left: 10px; background: white; padding: 10px;">
      <button @click="layerStore.toggleStibStopsLayer">
        {{ layerStore.showStibStopsLayer ? 'Hide' : 'Show' }} STIB Stops
      </button>
      <div v-if="stibStopsLoading">Loading...</div>
    </div>
  </div>
</template>