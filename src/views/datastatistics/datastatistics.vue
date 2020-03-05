<template>
  <div class="app-container">
    <div id="left"  style="width: 600px;height:400px;"></div>
    <div id="right"  style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
  import echart from 'echarts'
  import liquidfill from "echarts-liquidfill";

  export default {
    name: "datastatistics",
    components: {},
    props: {},
    data(){
      return{
      }
    },
    mounted() {
      this.initChartsLeft();
      this.initChartsRight();
    },
    methods: {
      initChartsRight(){
        let right = echart.init(document.getElementById("right"));
        this.setOptionsRight(right);
      },
      setOptionsRight(right){
        right.setOption({
          graphic: [
            {
              type: "group",
              left: "center",
              bottom: 10,
              children: [
                {
                  type: "text",
                  z: 100,
                  left: "120",
                  top: "middle",
                  style: {
                    fill: "#000",
                    text: "测试效果",
                    font: "24px Microsoft YaHei"
                  }
                }
              ]
            }
          ],
          title: {
            text: '水波晃动的效果'
          },
          series: [{
            type: 'liquidFill',
            radius: "95%",
            // data: [0.5, {value: 0.5, phase: Math.PI}],
            data: [0.6, 0.5, 0.4],
            phase: 0,
            period: 4000,
            waveLength: '100%',
            animationDurationUpdate: 2000,
          }]
        });
      },
      initChartsLeft() {
        let left = echart.init(document.getElementById("left"));
        this.setOptionsLeft(left,true); //数据发生变化，第二个参数为true
      },
      setOptionsLeft(left) {
        left.setOption({
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data:['销量']
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        })
      }
    }
  }
  // 如果是数据发生改变， 那么使用watch监听。
  //第一种 watch options变化 利用vue的深度 watcher，options一有变化就重新setOption
  //第二种 只watch 数据的变化 只有数据变化时触发ECharts

  // 如果不使用watch
  //第三种：绘画得到数据用的是异步请求，那么有可能出先dom实例没有先加载你就绘画的情况，可以使用setTimeout
</script>

<style scoped>

</style>