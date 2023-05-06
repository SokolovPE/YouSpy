<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex text-center fill-height">
      <v-row class="d-flex ma-0">
        <v-col cols="12">
          <v-row>
          <v-autocomplete
            :items="users"
            color="white"
            item-title="fullName"
            item-value="login"
            label="userList"
            v-model="selectedUser"
          />
          <v-btn
            class="mr-2"
            color="primary"
            @click="loadTimeSpent"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >Load time</v-btn>
          </v-row>

          <canvas id="mainChart" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
  import {Chart, ChartItem, ChartConfiguration, ChartDataset, Color, ScriptableContext, Colors} from "chart.js/auto";
  import {TreemapDataPoint, TreemapController, TreemapElement, TreemapConfig, TreemapScriptableContext, TreemapControllerDatasetOptions, AnyObject} from 'chartjs-chart-treemap';
  import { reactive, ref, onMounted } from 'vue';
  import { IUserService } from "@/interfaces/IUserService";
  import { ISpentTimeService } from "@/interfaces/ISpentTimeService"
  import container from "@/config/ioc_config";
  import SERVICE_IDENTIFIER from "@/constants/identifiers";
  import User from "@/models/user";
  import TimeSpentVM from "@/models/timeSpentVM";

  Chart.register(TreemapController, TreemapElement);
  let canvasTag : ChartItem;

  const dataset = ref<TreemapControllerDatasetOptions<TimeSpentVM>[]>([
      {
        data: [],
        captions: {
          display: true,
          formatter: (ctx: TreemapScriptableContext) : string => {
            return ctx.type === 'data' ? 'G: ' + ctx.raw.g : '';
          }
        },
        labels: {
          display: true,
          align: 'left',
          position: 'bottom'
        },
        label: 'My treemap dataset',
        tree: [],
        key: 'spent',
        groups: ['type'],
        borderWidth: 1,
        spacing: 0,
        backgroundColor: (ctx: TreemapScriptableContext) : Color => {
          if(ctx.type != 'data') {
            return 'transparent';
          }
          let color = "rgb(244, 67, 54)";
          switch (ctx.raw.g) {
            case "Implementation":
              color = "rgb(244, 67, 54)";
              break;
            case "Testing":
              color = "rgb(33, 150, 243)";
              break;
            case "Investigation":
              color = "rgb(76, 175, 80)";
              break;
            default:
              color = "rgb(103, 58, 183)";
              break;
          }
          return color;
        }
      }
    ]);

    const config : ChartConfiguration = {
      type: "treemap",
      data: {
        datasets: dataset.value,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Some treemap chart..."
          },
          legend: {
            display: false
          }
        }
      }
    };

  /*const data = reactive({
    str: 1,
    users: [] as User[]
  })*/

  const users = ref([] as User[]);
  const selectedUser = ref();
  const timeSpendings = ref([] as TimeSpentVM[]);
  //const str = ref(1);

  async function loadUsers() {
    let userService = container.get<IUserService>(SERVICE_IDENTIFIER.IUserService);
    users.value = await userService.getUsers();
    if(users.value.length > 0) {
      selectedUser.value = users.value[0];
    }
    //str.value = 2;
  };

  async function loadTimeSpent() {
    let timeService = container.get<ISpentTimeService>(SERVICE_IDENTIFIER.ISpentTimeService);
    timeSpendings.value = await timeService.getSpentTimeVM(new Date(), selectedUser.value);
    dataset.value[0].tree = timeSpendings.value;
    new Chart(canvasTag, config);
  }

  onMounted(async ()=> {
    canvasTag = <ChartItem>document.getElementById("mainChart")
    await loadUsers();
  });
</script>
