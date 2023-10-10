/**
 * echarts图表无数据占位
 * @param {echarts} chart 作业类型
 * @param {Boolean} isEmpty 有无数据
 */
 export function chartLoading(chart, isEmpty) {
    if (isEmpty) {
      chart.showLoading({
        text: "暂无数据",
        fontSize: '13px',
        showSpinner: false,
        textColor: "#909399",
        maskColor: "rgba(255, 255, 255, 0)"
      });
    } else {
      chart.hideLoading();
    }
  }
  