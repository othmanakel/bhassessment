<template>
    <div class="layout-wrapper">
        <div class="layout-main-container">
            <div class="layout-main">
              <div class="grid grid-cols-12 gap-8">
                  <div class="col-span-12 lg:col-span-6 xl:col-span-2">
                      <div class="card mb-0">
                          <div class="flex justify-between mb-4">
                              <div>
                                  <span class="block text-muted-color font-medium mb-4">Messages</span>
                                  <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{countData.messageCount}}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-span-12 lg:col-span-6 xl:col-span-2">
                      <div class="card mb-0">
                          <div class="flex justify-between mb-4">
                              <div>
                                  <span class="block text-muted-color font-medium mb-4">2.4GHz Drones</span>
                                  <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{countData.bandCountTwo}}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-span-12 lg:col-span-6 xl:col-span-2">
                      <div class="card mb-0">
                          <div class="flex justify-between mb-4">
                              <div>
                                  <span class="block text-muted-color font-medium mb-4">5.8GHZ Drones</span>
                                  <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{countData.bandCountFive}}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-span-12 lg:col-span-6 xl:col-span-2">
                      <div class="card mb-0">
                          <div class="flex justify-between mb-4">
                              <div>
                                  <span class="block text-muted-color font-medium mb-4">Ocusync Drones</span>
                                  <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{countData.classificationCountOcu}}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-span-12 lg:col-span-6 xl:col-span-2">
                      <div class="card mb-0">
                          <div class="flex justify-between mb-4">
                              <div>
                                  <span class="block text-muted-color font-medium mb-4">Lightbridge Drones</span>
                                  <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{countData.classificationCountLight}}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-span-12 xl:col-span-7">
                      <div class="card">
                          <div class="font-semibold text-xl mb-4">Active Detections</div>
                          <DataTable :value="latestMessage.detections" sortField="start_time" :sortOrder="1" tableStyle="min-width: 50rem">
                              <Column field="drone_id" header="Drone ID">
                              <template #body="{ data }">
                                  <Button variant="link" v-on:click="getRssiValuesLast5min(data.drone_id)">{{ data.drone_id }}</Button>
                              </template> 
                          </Column>
                              <Column field="band" header="Band"></Column>
                              <Column field="classification" header="Classification"></Column>
                              <Column field="rssi" header="RSSI"></Column>
                              <Column field="start_time" header="Duration" :sortable="true">
                                <template #body="{ data }">
                                        {{ calculateDuration(data.start_time)  }} Seconds
                                  </template>  
                              </Column>
                          </DataTable>
                      </div>
                  </div>
                  <div class="col-span-12 xl:col-span-5">
                      <div class="card">
                          <div class="font-semibold text-xl mb-4">Drone RSSI (Last 5 min)</div>
                          <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
                      </div>
                  </div>
              </div>
            </div>      
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      latestMessage: {
        msg_type: "",
        system: "",
        msg_id: "",
        detections: [],
        timestamp: ""
      },
      countData: {
        messageCount: 0,
        bandCountTwo: 0,
        bandCountFive: 0,
        classificationCountLight: 0,
        classificationCountOcu: 0,
      },
      chartData: {},
      chartOptions: { 
          maxBarThickness: 80,
      }
    }
  },
  methods: {
    getLatestMessage: function () {
      let self = this
      axios.get('/api/message/latest')
        .then(response => {
          self.latestMessage = response.data.message
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data.message)
          }
        })
    },
    getCountData: function () {
      let self = this
      axios.get('/api/message/countData')
        .then(response => {
          this.countData = response.data.countData
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data.message)
          }
        })
    },
    getRssiValuesLast5min: function (drone_id) {
      let self = this
      let last5min = 300000
      axios.get(`/api/message/rssi/${drone_id}/${last5min}`)
        .then(response => {
          self.rssiValues = response.data.rssiValues
          self.chartData = buildChartData(response.data.rssiValues)
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data.message)
          }
        })
    }, 
    calculateDuration: function(time) {
      let duration = Math.round((new Date().getTime() - new Date(time).getTime()) / 1000) //difference in seconds between curr time and start time of drone detection
      return duration
    }
  },
  mounted () {
    this.getLatestMessage()
    window.setInterval(() => { this.getLatestMessage() }, 1000)

    this.getCountData()
    window.setInterval(() => { this.getCountData() }, 1000)
  }
}

function buildChartData(rssiValues) {
  const documentStyle = getComputedStyle(document.documentElement)
  
  rssiValues.sort((a, b) => a.timestamp - b.timestamp)
  let labelData = rssiValues.map(x =>  new Date(x.timestamp).toLocaleString().substring(11, new Date(x.timestamp).toLocaleString().length)) //get hh-mm-ss of timestamp in local time
  let rssiData = rssiValues.map(x => x.rssi)
  return {
        labels: labelData,
        datasets: [
            {
                label: rssiValues && rssiValues.length > 0 ? 'Drone RSSI for Drone [' + rssiValues[0].drone_id + ']'  : 'Drone RSSI',
                data: rssiData,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                tension: 0.4
            }
        ]
    }
}
</script>
