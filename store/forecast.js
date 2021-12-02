import axios from 'axios'

export const state = () => ({
    forecasts: [], //全データ
    timeSeries: [], //直近予報
    weekSeries: [], //週間予報
    tempAverage: [], //一週間の最低、最高気温の平年値
    precipAverage: [], // 降水量の一週間（明日から７日先まで）合計の平年値
    timeWeathers: [], //3日間の天気予報
    timePops: [], //6時間毎の降水確率
    timeTemps: [], //朝の最低気温と日中の最高気温
    weekWeathers: [], //週間予報（天気、降水確率、信頼度）
    weekTemps: [], //週間気温予報（最気温、最低気温の予測下限、上限、最高気温、最高気温の予測下限、上限）
    dateNow:[], //降水確率用の配列
    timeNow:[], //日付時刻用の配列
    centers:[],
    offices:[],
    class10s:[],
    class15s:[],
    class20s:[],
    overview:[],
    
    recentTime:[],
    popTime:[],
    weekTime:[],
})

export const getters = {
  centers: function(state){
    return state.centers
  },
  offices: function(state){
    return state.offices
  },
  class10s: function(state){
    return state.class10s
  },
  class15s: function(state){
    return state.class15s
  },
  class20s:function(state){
    return state.class20s
  },
  
  forecasts: function(state){
    return state.forecasts
  },
  timeWeathers: function(state){
    return state.timeWeathers
  },
  timeTemps: function(state){
    return state.timeTemps
  },
  timePops: function(state){
    return state.timePops
  },
  weekWeathers: function(state){
    return state.weekWeathers
  },
  weekTemps: function(state){
    return state.weekTemps
  },
  tempAverage: function(state){
    return state.tempAverage
  },
  precipAverage: function(state){
    return state.precipAverage
  },
  recentTime: function(state){
    const recentTime = state.recentTime.map(m=>{
      return  dateformat(m,2,0)
    })
    return recentTime
  },
  popTime: function(state){
    return state.popTime
  },
  weekTime: function(state){
    const weekTime = state.weekTime.map(m=>{
      return m.map(f=>{
        return dateformat(f,3)
      })
    })
    return weekTime
  }
}

function dateformat(date, long, index){

  date = date.replace('+09:00','')
  date = new Date(date)
  
  const today = new Date()
  const nowHours = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))

  const y = date.getFullYear()
  const m = date.getMonth()+1
  const d = date.getDate()
  const day = '日月火水木金土'.charAt(date.getDay())
  const hh = date.getHours()
  const mm = date.getMinutes()
  
  if(long === 1){
    return `${y}年${m}月${d}日（${day}）${hh}時`
  }else if(long === 2){
    //console.log(nowHours)
    if(17 >= nowHours >= 5 && index === 0){
      return `今日${d}日（${day}）`
    }else if(nowHours >= 17 && index === 0){
      return `今夜${d}日（${day}）`
    }else if(index === 1){
      return `明日${d}日（${day}）`
    }else if(index === 2){
      return `明後日${d}日（${day}）`
    }
  }else if(long === 3){
    if(index === 0){
      return `明日${d}日（${day}）`
    }else if(index === 1){
      return `明後日${d}日（${day}）`
    }else{
      return `${d}日（${day}）`
    }
  }
}

export const mutations = {

  setArea: function(state, {areadata}){
    state.centers = areadata.centers
    state.offices = areadata.offices
    state.class10s = areadata.class10s
    state.class15s = areadata.class15s
    state.class20s = areadata.class20s
  },
  
  setForecast: function(state, {param}){
    param.items.filter(f=>{
      if(f.reportDatetime){
        f.reportDatetime = dateformat(f.reportDatetime, 1)
      }
    })
    
    param.items[0].timeSeries.filter((f,index)=>{
      if(index === 0){
        state.dateNow = []
        state.timeNow = []
        f.timeDefines.map((m,index)=>{
          state.timeNow.push(dateformat(m,2,index))
          const now = []
          m = m.replace('+09:00','')
          const dateNow = new Date(m)
          
          for(let i=0;i<4;i++){
            const y = dateNow.getFullYear()
            //const m = ('0' + dateNow.getMonth()+1).slice(-2)
            const m = ('0' + (dateNow.getMonth()+1)).slice(-2)
            const d = ('0' + dateNow.getDate()).slice(-2)
            const h = ('0'+dateNow.getHours(dateNow.setHours(i*6))).slice(-2)
            const mm = ('0'+dateNow.getMinutes(dateNow.setMinutes(0))).slice(-2)
            const s = ('0'+dateNow.getSeconds(dateNow.setSeconds(0))).slice(-2)
            now.push(`${y}-${m}-${d}T${h}:${mm}:${s}+09:00`)
          }
          state.dateNow.push(now)
        })
      }
    })
    
    param.items[0].timeSeries.map((m,index)=>{
      if(index === 0)state.recentTime = m.timeDefines
      if(index === 1)state.popTime = m.timeDefines
    })
    
    param.items[1].timeSeries.filter((m,index)=>{
      state.weekTime[index] = m.timeDefines
    })
    
    /*
    param.items[0].timeSeries[0].timeDefines.filter(m=>{
      state.timeNow.push(dateformat(m,2))
      const now = []
      m = m.replace('+09:00','')
      const dateNow = new Date(m)
      
      for(let i=0;i<4;i++){
        const y = dateNow.getFullYear()
        const m = dateNow.getMonth()+1
        const d = dateNow.getDate()
        const h = ('0'+dateNow.getHours(dateNow.setHours(i*6))).slice(-2)
        const mm = ('0'+dateNow.getMinutes(dateNow.setMinutes(0))).slice(-2)
        const s = ('0'+dateNow.getSeconds(dateNow.setSeconds(0))).slice(-2)
        now.push(`${y}-${m}-${d}T${h}:${mm}:${s}+09:00`)
        
        dateNow.setHours(i*6)
        dateNow.setMinutes(0)
        dateNow.setSeconds(0)
        dateNow.setMilliseconds(0)
        
        //now.push(dateNow.toISOString().split('.000Z')[0] + '+09:00')
      }
      state.dateNow.push(now)
    })
    */
    
    param.items[1].timeSeries.map(f=>{
        f.timeDefines = f.timeDefines.map((e,index)=>{
          return dateformat(e,3,index)
        })
    })
    
    state.forecasts = param.items
    
    state.timeSeries = param.items[0].timeSeries
    state.timeWeathers = param.items[0].timeSeries[0]
    state.timePops = param.items[0].timeSeries[1]
    
    state.timeTemps = param.items[0].timeSeries[2]
    
    state.weekSeries = param.items[1].timeSeries
    state.weekWeathers = param.items[1].timeSeries[0]
    state.weekTemps = param.items[1].timeSeries[1]
    
    state.tempAverage = param.items[1].tempAverage.areas
    state.precipAverage = param.items[1].precipAverage.areas
  },
  
  setOverview: function(state,{param}){
    
    param.items.reportDatetime = dateformat(param.items.reportDatetime,1)
    
    state.overview = param.items
  },

}

export const actions = {
  forecastIndex: async function({commit}){
    const url = 'https://www.jma.go.jp/bosai/common/const/area.json'
    return await axios.get(url)
    .then(res => {
      const areadata = res.data
      commit('setArea', {areadata})
    })
  },
  
  forecast: async function({commit},{url, area}){
      //const url = 'https://www.jma.go.jp/bosai/forecast/data/'
      //const area = 'overview_forecast/130000.json'
      return await axios.get(url + area)
      .then(res => {
          if(area.includes('overview')){
              const param = {
                  items: res.data,
              }
              commit('setForecast', {param})
          }else{
              const param = {
                  items:res.data,
              }
              commit('setForecast', {param})
          }
      })
  },
  
  forecastOverview: async function({commit},{url_overview,area}){
    
    return await axios.get(url_overview + area)
    .then(res=>{
      const param = {
        items: res.data,
      }
      commit('setOverview', {param})
    })
  }
  
    
}