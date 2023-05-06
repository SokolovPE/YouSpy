<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex text-center fill-height">
      <v-row class="d-flex ma-0">
        <v-col cols="12">
          <v-row>
            <v-autocomplete
              v-model="selectedUser"
              :items="users"
              color="white"
              item-title="fullName"
              item-value="login"
              label="userList"
            />
            <v-btn
              class="mr-2"
              color="primary"
              min-width="228"
              rel="noopener noreferrer"
              size="x-large"
              target="_blank"
              variant="flat"
              @click="loadTimeSpent"
            >
              Load time
            </v-btn>
          </v-row>

          <canvas id="mainChart" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import type { ChartItem, ChartConfiguration, Color } from 'chart.js/auto'
import { Chart } from 'chart.js/auto'
import type { TreemapScriptableContext, TreemapControllerDatasetOptions } from 'chartjs-chart-treemap'
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap'
import { ref, onMounted } from 'vue'
import type { IUserService } from '@/interfaces/IUserService'
import type { ISpentTimeService } from '@/interfaces/ISpentTimeService'
import container from '@/config/ioc_config'
import SERVICE_IDENTIFIER from '@/constants/identifiers'
import COLORS from '@/constants/colors'
import type User from '@/models/user'
import type TimeSpentVM from '@/models/timeSpentVM'

Chart.register(TreemapController, TreemapElement)
let canvasTag: ChartItem

const dataset = ref<TreemapControllerDatasetOptions<TimeSpentVM>[]>([
  {
    data: [],
    captions: {
      display: true,
      formatter: (ctx: TreemapScriptableContext): string => {
        return ctx.type === 'data' ? 'G: ' + ctx.raw.g : ''
      },
    },
    labels: {
      display: true,
      align: 'left',
      position: 'bottom',
    },
    label: 'My treemap dataset',
    tree: [],
    key: 'spent',
    groups: ['type'],
    borderWidth: 1,
    spacing: 0,
    backgroundColor: (ctx: TreemapScriptableContext): Color => {
      if (ctx.type != 'data') {
        return 'transparent'
      }
      let color = COLORS.Orange
      switch (ctx.raw.g) {
        case 'Implementation':
          color = COLORS.Orange
          break
        case 'Testing':
          color = COLORS.Blue
          break
        case 'Investigation':
          color = COLORS.Green
          break
        default:
          color = COLORS.Violet
          break
      }
      return color
    },
  },
]);

const config: ChartConfiguration = {
  type: 'treemap',
  data: {
    datasets: dataset.value,
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Some treemap chart...',
      },
      legend: {
        display: false,
      },
    },
  },
};

/* const data = reactive({
    str: 1,
    users: [] as User[]
  }) */

const users = ref([] as User[]);
const selectedUser = ref();
const timeSpendings = ref([] as TimeSpentVM[]);
let chart : Chart;

async function loadUsers (): Promise<void> {
  const userService = container.get<IUserService>(SERVICE_IDENTIFIER.IUserService);
  users.value = await userService.getUsers();
  if (users.value.length > 0) {
    selectedUser.value = users.value[0].login;
  }
}

async function loadTimeSpent () {
  const timeService = container.get<ISpentTimeService>(SERVICE_IDENTIFIER.ISpentTimeService);
  timeSpendings.value = await timeService.getSpentTimeVM(new Date(), selectedUser.value);
  dataset.value[0].tree = timeSpendings.value;
  chart.update();
}

onMounted(async () => {
  canvasTag = document.getElementById("mainChart") as ChartItem;
  await loadUsers();
  chart = new Chart(canvasTag, config);
})
</script>
