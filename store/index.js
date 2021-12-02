export const state = () => ({
    // データ初期値
    // content：タスク名、created：タイムスタンプ、state：タスクの状態
    todos: [
        {content: 'テスト', created: '2020-04-30 17:00', state: '作業前'}, 
        {content: 'コーディング', created: '2020-04-30 16:00', state: '作業中'},
        {content: '環境構築', created: '2020-04-30 15:30', state: '完了'}
    ],
    users: [],
    // changeState用にoptionを設定する
    option:[
        {id:0 ,label:'作業前'},
        {id:1 ,label:'作業中'},
        {id:2 ,label:'完了'}
    ]
})

export const mutations = {
    insert: function(state, obj) {
        //タイムスタンプ作成
        var d = new Date();
        var fmt = d.getFullYear() + '-' + 
                ('00' + (d.getMonth() + 1)).slice(-2) + '-' + 
                ('00' + d.getDate()).slice(-2) + ' ' + 
                ('00' + d.getHours()).slice(-2) + ':' + 
                ('00' + d.getMinutes()).slice(-2);
        // todos配列にunshiftで先頭に追加
        state.todos.unshift({
          content: obj.content,
          created: fmt,
          state: '作業前'
        })
    },
    
    remove: function(state, obj) {
          for(let i = 0; i < state.todos.length; i++) {
            const ob = state.todos[i];
            if(ob.content == obj.content && ob.created == obj.created) {
              if(confirm('"' + ob.content + '"を削除しますか？')){
                // i番目から1つをspliceで配列から削除
                return state.todos.splice(i, 1)
              }
            }
          }
    },
    
    changeState: function(state, obj){
          for(let i = 0; i < state.todos.length; i++) {
            const ob = state.todos[i]
            if(ob.content == obj.content && ob.created == obj.created && ob.state == obj.state) {
              let nowState
              for(let j = 0; j < state.option.length; j++){
                if(state.option[j].label == ob.state){
                  nowState = state.option[j].id
                }
              }
              nowState++;
              if(nowState >= state.option.length){
                nowState = 0
              }
              obj.state = state.option[nowState].label
              return
            }
          }
    },
}

export const actions = {
    userData: function(){
        
    }
}

/* クラシックモード
const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      todos: [
        {content: 'テスト', created: '2020-04-30 17:00', state: '作業前'}, 
        {content: 'コーディング', created: '2020-04-30 16:00', state: '作業中'},
        {content: '環境構築', created: '2020-04-30 15:30', state: '完了'}
      ],
      option:[
          {id:0 ,label:'作業前'},
          {id:1 ,label:'作業中'},
          {id:2 ,label:'完了'}
      ]
    }),
    mutations: {
      insert: function(state, obj) {
        var d = new Date();
        var fmt = d.getFullYear()
                + '-' + ('00' + (d.getMonth() + 1)).slice(-2)
                + '-' + ('00' + d.getDate()).slice(-2)
                + ' ' + ('00' + d.getHours()).slice(-2)
                + ':' + ('00' + d.getMinutes()).slice(-2);
        state.todos.unshift({
          content: obj.content,
          created: fmt,
          state: '作業前'
        })
      },
      remove: function(state, obj) {
          for(let i = 0; i < state.todos.length; i++) {
            const ob = state.todos[i];
            if(ob.content == obj.content && ob.created == obj.created) {
              if(confirm('"' + ob.content + '"を削除しますか？')){
                state.todos.splice(i, 1);
                return;
              }
            }
          }
      },
      changeState: function(state, obj){
          for(let i = 0; i < state.todos.length; i++) {
            const ob = state.todos[i];
            if(ob.content == obj.content && ob.created == obj.created && ob.state == obj.state) {
              let nowState;
              for(let j = 0; j < state.option.length; j++){
                if(state.option[j].label == ob.state){
                  nowState = state.option[j].id;
                }
              }
              nowState++;
              if(nowState >= state.option.length){
                nowState = 0;
              }
              obj.state = state.option[nowState].label
              return;
            }
          }
      },
    },
    
  })
}
*/


//クラシックモードの場合はindex.jsでexportする
//モジュールモードの場合はindex.jsでexportしない
//export default createStore;

